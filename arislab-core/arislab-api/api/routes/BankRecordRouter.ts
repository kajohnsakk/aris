import { Log } from "../ts-utils/Log";
import { ErrorObject } from "../ts-utils/ErrorObject";
import { JSONData as BankRecordJSON, BankRecord } from "../models/BankRecord";
import { ApiProxy } from "../modules/ApiProxy";
import { GBPay } from "../models/GBPay";

const timeUuid = require("time-uuid");

const express = require("express");
const router = express.Router();

router.get("/", (req: any, res: any) => {
  res.send({
    hello: "BankRecord router",
  });
});

router.get("/verifyID/:verifyID/", (req: any, res: any) => {
  let verifyID = req.params.verifyID;
  BankRecord.findById(verifyID).then((resultFindByID) => {
    res.send(resultFindByID);
    res.end();
  });
});

router.get("/findBankRecordsByStatus", (req: any, res: any) => {
  let isVerified = req.query.isVerified;
  let start = req.query.start;
  let stop = req.query.stop;

  if (!isVerified) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    BankRecord.findBankRecordsByStatus(isVerified, start, stop).then(
      (bankRecord) => {
        res.send(bankRecord);
        res.end();
      }
    );
  }
});

router.post("/new", async (req: any, res: any) => {
  try {
    Log.debug("req.body.bankRecordData: ", req.body.bankRecordData);
    Log.debug("req.body.storeData: ", req.body.storeData);

    let bankRecordData: BankRecordJSON;
    bankRecordData = req.body.bankRecordData;
    let storeData = req.body.storeData;

    if (!bankRecordData.hasOwnProperty("verifyID")) {
      bankRecordData.verifyID = timeUuid();
    }

    const { accountInfo } = bankRecordData;
    const bankAccount = accountInfo.accountNumber.replace(/-/g, "");
    const bankcode = accountInfo.bank.bankCode;

    const { resultCode, resultMessage } = await GBPay.verifyAccount(
      bankAccount,
      bankcode
    );

    if (resultCode !== "00") {
      throw new Error(resultMessage);
    }

    const paymentInfo = storeData.storeInfo.paymentInfo;
    paymentInfo.verifyInfo.isVerified = true;

    await ApiProxy.getInstance().sendRequest(
      "POST",
      `/payment/storeID/${storeData.storeID}/update`,
      storeData
    );

    Log.debug("Payment saved");

    res.status(200).send({ success: true, message: "Payment saved" });
    res.end();
  } catch (error) {
    Log.debug("BankRecord error while saving ", error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/verifyID/:verifyID/update", (req: any, res: any) => {
  Log.debug("verifyID is ", req.params.verifyID);
  Log.debug("req.body is", req.body);
  let verifyID = req.params.verifyID;

  let updateData: BankRecordJSON;
  updateData = {
    verifyID: verifyID,
    ...req.body,
  };

  Log.debug("update data is ", JSON.stringify(updateData));
  res.end();

  let updateObj = new BankRecord(updateData);
  return updateObj.update(updateData);
});

module.exports = router;
