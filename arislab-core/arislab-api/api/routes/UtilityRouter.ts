const uuidv4 = require("uuid/v4");
const Cryptr = require("cryptr");

import { Store, prototypeStoreJSONData } from "../models/Store";
import { Order } from "../models/Order";
import { GBPay } from "../models/GBPay";
import {
  Chatbot,
  JSONData as prototypeChatbotConfigJSONData,
} from "../models/Chatbot";
import { JSONData as ChannelJSON, Channel } from "../models/Channel";
import { ExternalProxy } from "../modules/ExternalProxy";
import { Utils } from "../ts-utils/Utils";
import { Log } from "../ts-utils/Log";
import { ErrorObject } from "../ts-utils/ErrorObject";
import * as express from "express";
import { Request, Response } from "express";

const router = express.Router();
const SECRET_KEY = new Cryptr("@R!$LAB");

const validateGBPayToken = (token: string) => {
  let RESPONSE_URL =
    process.env.PAYMENT_RESPONSE_URL ||
    "http://console.internal.arislab.ai:1380/site/payment/checkout/complete";
  let WEBHOOK_URL =
    process.env.PAYMENT_WEBHOOK_URL || "https://cloud.convolab.ai/iris/webhook";
  let tokenValidationBody = {
    token: token,
    amount: "1",
    referenceNo: new Date().getTime().toString(),
    payType: "F",
    cardUse: "Y",
    billUse: "Y",
    qrUse: "Y",
    expire: 30,
    deliveryMethod: "0",
    multipleUse: "Y",
    responseUrl: RESPONSE_URL,
    backgroundUrl: WEBHOOK_URL,
    detail: "",
  };

  return ExternalProxy.getInstance()
    .sendRequest({
      uri: "https://api.gbprimepay.com/gbp/gateway/link",
      method: "POST",
      body: tokenValidationBody,
    })
    .then((resultValidateGBPayToken: any) => {
      Log.debug("resultValidateGBPayToken ", resultValidateGBPayToken);
      return Promise.resolve(resultValidateGBPayToken);
    })
    .catch((err: any) => {
      return Promise.reject(err);
    });
};

router.post("/initStore/", (req: Request, res: Response) => {
  let auth0_uid = req.body.user_id;
  let email = req.body.email;
  let name = req.body.name;
  let uniqueStoreID = uuidv4();

  let initStoreData: prototypeStoreJSONData = {
    auth0_uid: auth0_uid,
    email: email || "",
    storeID: uniqueStoreID,
    createdAt: Date.now(),
    registeredTimestamp: 0,
    verifyInfo: {
      isVerified: false,
      verifiedAt: 0,
      otpID: "",
    },
    storeInfo: {
      businessProfile: {
        logo: "",
        accountDetails: {
          name: name,
          businessName: "",
        },
        businessEmail: email,
        businessPhoneNo: "",
        businessAddress: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      },
      policies: {
        privacyPolicy: "",
        returnRefundPolicy: "",
        shippingPolicy: "",
        cancellationPolicy: "",
      },
      paymentInfo: {
        bank: {},
        accountName: "",
        accountNumber: "",
        gbPayInfo: {
          token: "",
        },
        qrImage: "",
      },
      delivery: {
        price: {
          additionalPiece: "0",
          firstPiece: "0",
        },
      },
      personalInfo: {
        name: "",
        idCard: "",
        addressInfo: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          postalCode: "",
          state: "",
          country: "",
        },
      },
      companyInfo: {
        name: "",
        taxNumber: "",
        addressInfo: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          postalCode: "",
          state: "",
          country: "",
        },
        registeredAddressInfo: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          postalCode: "",
          state: "",
          country: "",
        },
      },
      storePackagePaymentInfo: {
        paymentType: "CREDIT_CARD",
      },
      config: {
        useCart: false,
        useCreditCard: false,
        useCashOnDelivery: false,
        useBusinessFeatures: false,
        useLastReply: false,
        lastReplyMessage: "",
      },
    },
  };

  let initDataObj = new Store(initStoreData);

  initDataObj
    .save()
    .then((resultSaveInitDataObj: any) => {
      res.send(resultSaveInitDataObj);
      res.end();
    })
    .catch((error: any) => {
      ErrorObject.INTERNAL_ERROR.send(res, `Error : ${error}`);
      res.end();
    });
});

router.post(
  "/initSalesChannel/storeID/:storeID",
  (req: Request, res: Response) => {
    let storeID = req.params.storeID;

    let initSalesChannelData: ChannelJSON = {
      storeID: storeID,
      channels: {
        facebook: "",
        facebookSelectedPage: {},
        facebookSelectedPageAccessToken: "",
      },
    };

    let initSalesChannelObj = new Channel(initSalesChannelData);

    initSalesChannelObj
      .save()
      .then((resultSaveInitSalesChannelObj: any) => {
        res.send(resultSaveInitSalesChannelObj);
        res.end();
      })
      .catch((error: any) => {
        ErrorObject.INTERNAL_ERROR.send(res, `Error : ${error}`);
        res.end();
      });
  }
);

router.post(
  "/initChatbotConfig/storeID/:storeID",
  (req: Request, res: Response) => {
    let storeID = req.params.storeID;

    let initChatbotConfigData: prototypeChatbotConfigJSONData = {
      storeID: storeID,
      config: {
        general: {
          botStatus: "active",
        },
        message: {
          CLASSIFY_FAILED_MSG: "",
          PRIVATE_REPLY_MSG: "",
        },
      },
    };

    let initChatbotConfigObj = new Chatbot(initChatbotConfigData);

    initChatbotConfigObj
      .save()
      .then((resultSaveInitChatbotConfigObj: any) => {
        res.send(resultSaveInitChatbotConfigObj);
        res.end();
      })
      .catch((error: any) => {
        ErrorObject.INTERNAL_ERROR.send(res, `Error : ${error}`);
        res.end();
      });
  }
);

router.get("/checkStore/email/:email", (req: Request, res: Response) => {
  let email = req.params.email;
  Store.findStoreByEmail(email).then((resultFindStoreByEmail: any) => {
    res.send(resultFindStoreByEmail);
    res.end();
  });
});

router.get("/checkStore/uid/:uid", (req: Request, res: Response) => {
  let auth0_uid = req.params.uid;
  Store.findStoreByAuth0UID(auth0_uid).then(
    (resultFindStoreByAuth0UID: any) => {
      res.send(resultFindStoreByAuth0UID);
      res.end();
    }
  );
});

router.get(
  "/emailDecoder/encodedEmail/:encodedEmail",
  (req: Request, res: Response) => {
    let encodedEmail = req.params.encodedEmail;
    let decryptedEmail = SECRET_KEY.decrypt(encodedEmail);
    res.send({
      result: decryptedEmail,
    });
    res.end();
  }
);

router.get("/storeIDLookup/email/:email", (req: Request, res: Response) => {
  let email = req.params.email;
  Store.findStoreIDByEmail(email).then((resultFindStoreIDByEmail: any) => {
    res.send(resultFindStoreIDByEmail);
    res.end();
  });
});

router.get("/storeIDLookup/pinCode/:pinCode", (req: Request, res: Response) => {
  let pinCode = req.params.pinCode;
  Store.findStoreIDByPinCode(pinCode).then(
    (resultFindStoreIDByPinCode: any) => {
      res.send(resultFindStoreIDByPinCode);
      res.end();
    }
  );
});

router.get(
  "/storeIDLookup/bankCode/:bankCode/accountNumber/:accountNumber",
  (req: Request, res: Response) => {
    let bankCode = req.params.bankCode;
    let accountNumber = req.params.accountNumber;
    Store.findStoreIDByPaymentInfo(bankCode, accountNumber).then(
      (resultFindStoreIDByPaymentInfo: any) => {
        res.send(resultFindStoreIDByPaymentInfo);
        res.end();
      }
    );
  }
);

// router.get('/storeInfoLookup/encodedEmail/:encodedEmail', (req: Request, res: Response) => {
//     let encryptedEmail = req.params.encodedEmail;
//     let decryptedEmail = SECRET_KEY.decrypt(encryptedEmail);
//     Store.findStoreIDByEmail(decryptedEmail).then((resultFindStoreIDByEmail: any) => {
//         res.send(resultFindStoreIDByEmail);
//         res.end();
//     });
// });

router.get("/storeInfoLookup", (req: Request, res: Response) => {
  let auth0_uid = req.query.auth0_uid;
  if (!auth0_uid) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    Store.findStoreIDByAuth0UID(auth0_uid).then(
      (resultFindStoreIDByAuth0UID: any) => {
        res.send(resultFindStoreIDByAuth0UID);
        res.end();
      }
    );
  }
});

router.post("/findStoreByCustomFields", (req: Request, res: Response) => {
  let fieldList: Array<{ fieldName: string; fieldValue: string }> = req.body;

  if (!fieldList) {
    ErrorObject.BAD_REQUEST.send(res);
  } else {
    Store.findByCustomFields(fieldList).then((resultFindByCustomFields) => {
      res.send(resultFindByCustomFields);
      res.end();
    });
  }
});

router.get(
  "/findOrderIDbyUUID/orderID/:orderID",
  (req: Request, res: Response) => {
    let orderID = req.params.orderID;

    Order.findUUIDbyOrderId(orderID).then((resultfindUUIDbyOrderId: any) => {
      res.send(resultfindUUIDbyOrderId);
      res.end();
    });
  }
);

router.post("/validateGBPayToken", async (req: Request, res: Response) => {
  let token = req.body.token;

  if (!token) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    try {
      let resultValidateGBPayToken = await validateGBPayToken(token);
      let tokenStatus = {
        status: "",
      };
      if (resultValidateGBPayToken.resultCode === "00") {
        tokenStatus["status"] = "VALID";
      } else {
        tokenStatus["status"] = "INVALID";
      }
      res.send(tokenStatus);
      res.end();
    } catch (error) {
      Log.error("Error while validating GBPay token ", error);
    }
  }
});

router.get("/getDefaultGBPayToken", (req: Request, res: Response) => {
  const tokenObj = {
    token: GBPay.TOKEN,
  };

  res.send(tokenObj);
  res.end();
});

router.post("/cryptData", (req: Request, res: Response) => {
  let secret_key = req.body.secret_key;
  let mode = req.body.mode;
  let data = req.body.data;

  if (!secret_key && mode && data) {
    throw new ErrorObject("Required fields are missing", 400);
  } else {
    let cryptedData = Utils.cryptrManager(secret_key, mode, data);
    res.send({ data: cryptedData });
    res.end();
  }
});

router.post("/isWalletToken", (req: Request, res: Response) => {
  const walletToken = GBPay.TOKEN.trim();
  const token = req.body.token.trim();

  let resultCheckWalletToken = false;

  if (walletToken === token) {
    resultCheckWalletToken = true;
  }

  res.send({ result: resultCheckWalletToken });
  res.end();
});

router.post("/pushFields", async (req: Request, res: Response) => {
  try {
    const type = req.body.type;
    const fieldPath = req.body.fieldPath;
    const fieldObj = req.body.fieldObj;

    const resultPushFields = await Utils.pushFields(type, fieldPath, fieldObj);
    res.send(resultPushFields);
    res.end();
  } catch (error) {
    Log.error("Error while pushing fields: ", error);
    throw error;
  }
});

module.exports = router;
