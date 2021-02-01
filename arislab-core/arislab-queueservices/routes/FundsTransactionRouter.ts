import * as express from "express";
import { Request, Response } from "express";
import { Job, DoneCallback } from "kue";
import { Log } from "../utils/Log";
import { Utils } from "../utils/Utils";
import { ApiProxy } from "../modules/ApiProxy";
import { ExternalProxy } from "../modules/ExternalProxy";
import { PdfGenerator } from "../modules/PdfGenerator";
import { CsvGenerator } from "../modules/CsvGenerator";

const kue = require("kue");
const router = express.Router();

const queue = kue.createQueue({
  redis: { host: process.env.REDIS_HOST },
});

const FEE = Number(process.env.GB_PAY_FEE) || 0;
const AMOUNT_FOR_NO_FEE = Number(process.env.GB_PAY_AMOUNT_FOR_NO_FEE) || 0;
const WITHDRAW_MODE = process.env.WITHDRAW_MODE || "REALTIME";

const QUEUESERVICE_PORT = process.env.QUEUESERVICE_PORT;
const API_URL = `http://localhost:${QUEUESERVICE_PORT}/`;

const queueApi = (status: string) => {
  return ExternalProxy.getInstance().sendRequest({
    uri: `${API_URL}queue/dashboard/jobs/${status}/0..1000/asc`,
    method: "GET",
  });
};

const findStoreIDInQueue = (queues: any, storeID: string) => {
  return queues.find((q: any) => q.data.storeID === storeID);
};

router.post("/withdraw", async (req: Request, res: Response) => {
  Log.debug("Incoming request to withdraw queue service is : ", req.body);
  try {
    let storeID = req.body.storeID;
    let amount = req.body.amount;
    let invoiceCustomerData = req.body.invoiceCustomerData;

    const [inactiveQueues, activeQueues] = await Promise.all([
      queueApi("inactive"),
      queueApi("active"),
    ]);

    const foundStoreInactiveQueue = findStoreIDInQueue(inactiveQueues, storeID);
    const foundStoreActiveQueue = findStoreIDInQueue(activeQueues, storeID);

    if (foundStoreInactiveQueue || foundStoreActiveQueue) {
      Log.error("Withdraw process already in queue");
      throw new Error("Withdraw process already in queue");
    }

    Log.debug(`Create queue withdraw transaction.....`);
    const { type, data } = await queue
      .create("WITHDRAW", {
        title: "Withdraw",
        storeID: storeID,
        amount: amount,
        invoiceCustomerData: invoiceCustomerData,
      })
      .priority("high")
      .save();

    Log.debug(`Queue info`, {
      type: type,
      data: data,
    });

    res.status(201).send({ status: "success" });
  } catch (error) {
    Log.error("Error while withdrawing money store: ", error);
    res.status(400).send({ status: "fail", message: error.message });
  }
});

queue.process("WITHDRAW", async (job: Job, done: DoneCallback) => {
  Log.debug(`Process queue type: ${job.type} with data: `, job.data);
  let storeID = job.data.storeID;
  let amount = Utils.convertTo2decimal(job.data.amount);
  let invoiceCustomerData = job.data.invoiceCustomerData;
  let serviceFeeList: Array<{ [key: string]: any }> = [];
  let documentNumber: string = "";
  let orders: Array<{ [key: string]: any }> = [];
  let actualAmount = 0;
  let fee = 0;

  if (storeID && storeID.length > 0 && amount && amount > 0) {
    var fundsTransactionList = await ApiProxy.getInstance().sendRequest(
      "GET",
      `/fundsTransaction/storeID/${storeID}`
    );
    Log.debug(
      `Get funds transaction list of storeID: ${storeID}, result: `,
      fundsTransactionList
    );

    var depositFundsTransactionList = await Utils.calculateDepositFundsTransaction(
      fundsTransactionList
    );
    Log.debug(
      `Get deposit funds transaction list of storeID: ${storeID}, result: `,
      depositFundsTransactionList.length
    );

    var orderList = await ApiProxy.getInstance().sendRequest(
      "GET",
      `/order/storeID/${storeID}?status=SUCCESS`
    );
    Log.debug(
      `Get order list of storeID: ${storeID}, result: `,
      orderList.length
    );

    orders = await Utils.generateOrderDataForInvoice(
      depositFundsTransactionList,
      orderList
    );
    Log.debug(`Invoice order list: `, orders);

    var fundsTransactionData = await Utils.calculateFundsTransaction(
      depositFundsTransactionList
    );
    var deposit = fundsTransactionData["deposit"];
    var depositFee = fundsTransactionData["depositFee"];
    var withdraw = fundsTransactionData["withdraw"];
    var withdrawableAmount = Utils.convertTo2decimal(
      deposit - depositFee - withdraw
    );
    Log.debug(
      `Deposit is: ${deposit}, and Deposit fee is: ${depositFee}. Withdrawable amount of storeID [${storeID}] is: ${withdrawableAmount}`
    );
    Log.debug(
      `GBPay fee is: ${FEE}, and amount for no fee is: ${AMOUNT_FOR_NO_FEE}`
    );

    if (withdrawableAmount > FEE && withdrawableAmount >= amount) {
      amount = withdrawableAmount;

      var businessInfo = await ApiProxy.getInstance().sendRequest(
        "GET",
        `/payment/storeID/${storeID}`
      );
      Log.debug(
        `Get business info of storeID: ${storeID}, result: `,
        businessInfo
      );
      if (businessInfo.storeInfo.hasOwnProperty("paymentInfo")) {
        var paymentInfo = businessInfo.storeInfo.paymentInfo;

        if (
          paymentInfo.accountNumber.length > 0 &&
          paymentInfo.bank.bankCode.length > 0
        ) {
          if (amount >= AMOUNT_FOR_NO_FEE) {
            actualAmount = amount;
          } else {
            actualAmount = amount - FEE;
            fee = FEE;
          }

          const dataForGB = {
            bankAccount: paymentInfo.accountNumber.replace(/-/g, ""),
            accountName: paymentInfo.accountName,
            bankCode: paymentInfo.bank.bankCode,
            amount: Utils.convertTo2decimal(actualAmount),
            timeline: Utils.timeline(WITHDRAW_MODE),
          };

          Log.debug(`Call GBPrimePay Transfers API with body: `, dataForGB);
          let result = await ApiProxy.getInstance().sendRequest(
            "POST",
            `/gbpay/withdrawTransaction`,
            dataForGB
          );

          Log.debug(`Result from GBPrimePay Transfers API is: `, result);

          let statusCode = result.resultCode;
          let referenceNo = result.referenceNo;
          let invoiceFileUrl = "";
          let orderFileUrl = "";
          let newInvoiceID = "";

          let status = "FAIL";
          let createdAt = Date.now();
          let isDeleted = true;
          let deletedAt = Date.now();
          if (statusCode === "00") {
            status = "SUCCESS";
            isDeleted = false;
            deletedAt = 0;

            let invoiceList = await ApiProxy.getInstance().sendRequest(
              "GET",
              `/invoice/nowMonth`
            );
            documentNumber = Utils.generateInvoiceDocumentNumber(
              "01",
              invoiceList.length
            );
            serviceFeeList.push({
              description: "Service fee",
              amount: 1,
              unitPrice: depositFee,
              discountPercent: 0,
            });
            Log.debug(`Create document number: ${documentNumber}`);

            // Create INVOICE File
            let invoiceData = Utils.generateInvoiceData(
              documentNumber,
              invoiceCustomerData,
              serviceFeeList,
              0,
              orders
            );
            Log.debug(`Create invoice data success.`);
            const pdfGenerator = new PdfGenerator();
            pdfGenerator.setTemplate("invoice.html");
            pdfGenerator.setContent(invoiceData);
            pdfGenerator.setSaveFileName(`${documentNumber}.pdf`);
            await pdfGenerator.createPDF();
            let saveInvoiceFilePath = pdfGenerator.getSaveFilePath();

            // Create Order File
            let csvHeader = Utils.generateOrderCsvHeader();
            let csvData = Utils.generateOrderCsvData(orders);
            Log.debug(`Create csv data success.`);
            const csvGenerator = new CsvGenerator();
            csvGenerator.setSaveFileName(`ORDER_${documentNumber}.csv`);
            csvGenerator.setCsvHeader(csvHeader);
            csvGenerator.setCsvData(csvData);
            await csvGenerator.createCsv();
            let saveOderFilePath = csvGenerator.getSaveFilePath();

            // Upload to S3
            invoiceFileUrl = await ApiProxy.getInstance().uploadFileFromPath(
              "invoice",
              saveInvoiceFilePath,
              "application/pdf"
            );
            Log.debug("Upload file result: ", invoiceFileUrl);
            orderFileUrl = await ApiProxy.getInstance().uploadFileFromPath(
              "invoice",
              saveOderFilePath,
              "text/csv"
            );
            Log.debug("Upload file result: ", orderFileUrl);

            invoiceData["invoiceFileUrl"] = invoiceFileUrl;
            invoiceData["orderFileUrl"] = orderFileUrl;

            // Insert invoice
            Log.debug(`Save invoice with body: `, invoiceData);
            newInvoiceID = await ApiProxy.getInstance().sendRequest(
              "POST",
              `/invoice/new`,
              invoiceData
            );
            Log.debug(`Result from save invoice is: `, newInvoiceID);
          }

          const data = {
            storeID: storeID,
            amount: Number(amount),
            actualAmount: Utils.convertTo2decimal(actualAmount),
            fee: fee,
            type: "WITHDRAW",
            orderInfo: {
              orderID: "",
              customerName: "",
            },
            withdrawInfo: {
              status: status,
              statusCode: statusCode,
              referenceNo: referenceNo,
              invoiceID: newInvoiceID,
              invoiceFileUrl: invoiceFileUrl,
              orderFileUrl: orderFileUrl,
            },
            createdAt: createdAt,
            isDeleted: isDeleted,
            deletedAt: deletedAt,
          };

          Log.debug(`Save withdraw transaction with body: `, data);
          result = await ApiProxy.getInstance().sendRequest(
            "POST",
            `/fundsTransaction/new`,
            data
          );
          Log.debug(`Result from save withdraw transaction is: `, result);

          let processStatus = "";
          if (statusCode === "00") {
            processStatus = `Success balance has transfered`;
          } else if (statusCode === "01") {
            processStatus = `Balance is not enough while calling transfer api`;
          } else if (statusCode === "02") {
            processStatus = `Bank account not found while calling transfer api`;
          } else if (statusCode === "99") {
            processStatus = `System error while calling transfer api`;
          } else {
            processStatus = `Unknown error while calling transfer api`;
          }

          if (statusCode === "00") {
            Log.debug(
              `Done process queue type: ${job.type} with: (${statusCode}) "${processStatus}".`
            );
            setTimeout(function () {
              done();
            }, 2000);
          } else {
            Log.error(
              `Done process queue type: ${job.type} with error: (${statusCode}) "${processStatus}".`
            );
            done(new Error(processStatus));
          }
        } else {
          Log.error(`Not found bank code or bank account number of store.`);
          done(new Error(`Not found bank code or bank account number`));
        }
      } else {
        Log.error(`Not found payment info of store.`);
        done(new Error(`Not found payment info`));
      }
    } else {
      Log.error(
        `Remaining balance of storeID: ${storeID} is not enough to withdraw.`
      );
      done(new Error(`Remaining balance is not enough to withdraw`));
    }
  } else {
    Log.error(`Not found storeID or amount.`);
    done(new Error(`Not found storeID or amount`));
  }
});

module.exports = router;
