export {};
import { GBPayData, inputGBPayDataJSON, GBPay } from "../models/GBPay";
import { ICreditCard, CreditCard } from "../models/CreditCard";
import { ErrorObject } from "../ts-utils/ErrorObject";
import { Log } from "../ts-utils/Log";

const express = require("express");
const router = express.Router();

const formidableMiddleware = require("express-formidable");
const timeUuid = require("time-uuid");

router.get("/", (req: any, res: any) => {
  res.send("Hello World");
  res.end();
});

router.post("/generateGBPayLink", (req: any, res: any) => {
  let data: inputGBPayDataJSON = req.body.data;

  if (!data) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    GBPay.generateLink(data).then((resultGeneratedLink: any) => {
      res.send(resultGeneratedLink);
      res.end();
    });
  }
});

router.post("/checkTransactionStatus", (req: any, res: any) => {
  let referenceNo = req.body.referenceNo;

  if (!referenceNo) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    GBPay.checkTransactionStatus(referenceNo).then(
      (resultCheckTransactionStatus: any) => {
        res.send(resultCheckTransactionStatus);
        res.end();
      }
    );
  }
});

router.post("/voidTransaction", (req: any, res: any) => {
  let gbpReferenceNo = req.body.gbpReferenceNo;
  let secret_key = req.body.secret_key || "";

  if (!gbpReferenceNo) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    GBPay.voidTransaction(gbpReferenceNo, secret_key).then(
      (resultVoidTransaction: any) => {
        res.send(resultVoidTransaction);
        res.end();
      }
    );
  }
});

router.post(
  "/handleVerifyQRCode",
  formidableMiddleware(),
  (req: any, res: any) => {
    Log.debug("[handleVerifyQRCode] req.fields", req.fields);
    let referenceNo = req.fields.referenceNo;
    let gbpReferenceNo = req.fields.gbpReferenceNo;
    let amount = req.fields.amount;

    if (!referenceNo && gbpReferenceNo && amount) {
      throw ErrorObject.NULL_OBJECT;
    } else {
      GBPay.verifyQRCodeTransaction(referenceNo, gbpReferenceNo, amount).then(
        (resultVerifyQRCodeTransaction: {
          resultCode: string;
          referenceNo: string;
          gbpReferenceNo: string;
        }) => {
          res.send(resultVerifyQRCodeTransaction);
          res.end();
        }
      );
    }
  }
);

router.post("/withdrawTransaction", (req: any, res: any) => {
  Log.debug("[withdrawTransaction] req.body => ", req.body);
  let nowHour = new Date().getHours();
  let bankAccount = req.body.bankAccount;
  let accountName = req.body.accountName;
  let bankCode = req.body.bankCode;
  let amount = req.body.amount;
  let timeline =
    req.body.timeline || req.body.timeline === 0
      ? req.body.timeline
      : nowHour >= 0 && nowHour < 12
      ? 1
      : 2;

  if (!(bankAccount && bankCode && amount)) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    GBPay.withdrawTransaction(
      bankAccount,
      accountName,
      bankCode,
      amount,
      timeline
    ).then((resultWithdrawTransaction: any) => {
      res.send(resultWithdrawTransaction);
      res.end();
    });
  }
});

module.exports = router;
