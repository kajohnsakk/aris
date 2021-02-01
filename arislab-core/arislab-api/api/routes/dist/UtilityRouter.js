"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var uuidv4 = require("uuid/v4");
var Cryptr = require("cryptr");
var Store_1 = require("../models/Store");
var Order_1 = require("../models/Order");
var GBPay_1 = require("../models/GBPay");
var Chatbot_1 = require("../models/Chatbot");
var Channel_1 = require("../models/Channel");
var ExternalProxy_1 = require("../modules/ExternalProxy");
var Utils_1 = require("../ts-utils/Utils");
var Log_1 = require("../ts-utils/Log");
var ErrorObject_1 = require("../ts-utils/ErrorObject");
var express = require("express");
var router = express.Router();
var SECRET_KEY = new Cryptr("@R!$LAB");
var validateGBPayToken = function (token) {
    var RESPONSE_URL = process.env.PAYMENT_RESPONSE_URL ||
        "http://console.internal.arislab.ai:1380/site/payment/checkout/complete";
    var WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL || "https://cloud.convolab.ai/iris/webhook";
    var tokenValidationBody = {
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
        detail: ""
    };
    return ExternalProxy_1.ExternalProxy.getInstance()
        .sendRequest({
        uri: "https://api.gbprimepay.com/gbp/gateway/link",
        method: "POST",
        body: tokenValidationBody
    })
        .then(function (resultValidateGBPayToken) {
        Log_1.Log.debug("resultValidateGBPayToken ", resultValidateGBPayToken);
        return Promise.resolve(resultValidateGBPayToken);
    })["catch"](function (err) {
        return Promise.reject(err);
    });
};
router.post("/initStore/", function (req, res) {
    var auth0_uid = req.body.user_id;
    var email = req.body.email;
    var name = req.body.name;
    var uniqueStoreID = uuidv4();
    var initStoreData = {
        auth0_uid: auth0_uid,
        email: email || "",
        storeID: uniqueStoreID,
        createdAt: Date.now(),
        registeredTimestamp: 0,
        verifyInfo: {
            isVerified: false,
            verifiedAt: 0,
            otpID: ""
        },
        storeInfo: {
            businessProfile: {
                logo: "",
                accountDetails: {
                    name: name,
                    businessName: ""
                },
                businessEmail: email,
                businessPhoneNo: "",
                businessAddress: {
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: ""
                }
            },
            policies: {
                privacyPolicy: "",
                returnRefundPolicy: "",
                shippingPolicy: "",
                cancellationPolicy: ""
            },
            paymentInfo: {
                bank: {},
                accountName: "",
                accountNumber: "",
                gbPayInfo: {
                    token: ""
                },
                qrImage: ""
            },
            delivery: {
                price: {
                    additionalPiece: "0",
                    firstPiece: "0"
                }
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
                    country: ""
                }
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
                    country: ""
                },
                registeredAddressInfo: {
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    postalCode: "",
                    state: "",
                    country: ""
                }
            },
            storePackagePaymentInfo: {
                paymentType: "CREDIT_CARD"
            },
            config: {
                useCart: false,
                useCreditCard: false,
                useCashOnDelivery: false,
                useBusinessFeatures: false,
                useLastReply: false,
                lastReplyMessage: ""
            }
        }
    };
    var initDataObj = new Store_1.Store(initStoreData);
    initDataObj
        .save()
        .then(function (resultSaveInitDataObj) {
        res.send(resultSaveInitDataObj);
        res.end();
    })["catch"](function (error) {
        ErrorObject_1.ErrorObject.INTERNAL_ERROR.send(res, "Error : " + error);
        res.end();
    });
});
router.post("/initSalesChannel/storeID/:storeID", function (req, res) {
    var storeID = req.params.storeID;
    var initSalesChannelData = {
        storeID: storeID,
        channels: {
            facebook: "",
            facebookSelectedPage: {},
            facebookSelectedPageAccessToken: ""
        }
    };
    var initSalesChannelObj = new Channel_1.Channel(initSalesChannelData);
    initSalesChannelObj
        .save()
        .then(function (resultSaveInitSalesChannelObj) {
        res.send(resultSaveInitSalesChannelObj);
        res.end();
    })["catch"](function (error) {
        ErrorObject_1.ErrorObject.INTERNAL_ERROR.send(res, "Error : " + error);
        res.end();
    });
});
router.post("/initChatbotConfig/storeID/:storeID", function (req, res) {
    var storeID = req.params.storeID;
    var initChatbotConfigData = {
        storeID: storeID,
        config: {
            general: {
                botStatus: "active"
            },
            message: {
                CLASSIFY_FAILED_MSG: "",
                PRIVATE_REPLY_MSG: ""
            }
        }
    };
    var initChatbotConfigObj = new Chatbot_1.Chatbot(initChatbotConfigData);
    initChatbotConfigObj
        .save()
        .then(function (resultSaveInitChatbotConfigObj) {
        res.send(resultSaveInitChatbotConfigObj);
        res.end();
    })["catch"](function (error) {
        ErrorObject_1.ErrorObject.INTERNAL_ERROR.send(res, "Error : " + error);
        res.end();
    });
});
router.get("/checkStore/email/:email", function (req, res) {
    var email = req.params.email;
    Store_1.Store.findStoreByEmail(email).then(function (resultFindStoreByEmail) {
        res.send(resultFindStoreByEmail);
        res.end();
    });
});
router.get("/checkStore/uid/:uid", function (req, res) {
    var auth0_uid = req.params.uid;
    Store_1.Store.findStoreByAuth0UID(auth0_uid).then(function (resultFindStoreByAuth0UID) {
        res.send(resultFindStoreByAuth0UID);
        res.end();
    });
});
router.get("/emailDecoder/encodedEmail/:encodedEmail", function (req, res) {
    var encodedEmail = req.params.encodedEmail;
    var decryptedEmail = SECRET_KEY.decrypt(encodedEmail);
    res.send({
        result: decryptedEmail
    });
    res.end();
});
router.get("/storeIDLookup/email/:email", function (req, res) {
    var email = req.params.email;
    Store_1.Store.findStoreIDByEmail(email).then(function (resultFindStoreIDByEmail) {
        res.send(resultFindStoreIDByEmail);
        res.end();
    });
});
router.get("/storeIDLookup/pinCode/:pinCode", function (req, res) {
    var pinCode = req.params.pinCode;
    Store_1.Store.findStoreIDByPinCode(pinCode).then(function (resultFindStoreIDByPinCode) {
        res.send(resultFindStoreIDByPinCode);
        res.end();
    });
});
router.get("/storeIDLookup/bankCode/:bankCode/accountNumber/:accountNumber", function (req, res) {
    var bankCode = req.params.bankCode;
    var accountNumber = req.params.accountNumber;
    Store_1.Store.findStoreIDByPaymentInfo(bankCode, accountNumber).then(function (resultFindStoreIDByPaymentInfo) {
        res.send(resultFindStoreIDByPaymentInfo);
        res.end();
    });
});
// router.get('/storeInfoLookup/encodedEmail/:encodedEmail', (req: Request, res: Response) => {
//     let encryptedEmail = req.params.encodedEmail;
//     let decryptedEmail = SECRET_KEY.decrypt(encryptedEmail);
//     Store.findStoreIDByEmail(decryptedEmail).then((resultFindStoreIDByEmail: any) => {
//         res.send(resultFindStoreIDByEmail);
//         res.end();
//     });
// });
router.get("/storeInfoLookup", function (req, res) {
    var auth0_uid = req.query.auth0_uid;
    if (!auth0_uid) {
        throw ErrorObject_1.ErrorObject.NULL_OBJECT;
    }
    else {
        Store_1.Store.findStoreIDByAuth0UID(auth0_uid).then(function (resultFindStoreIDByAuth0UID) {
            res.send(resultFindStoreIDByAuth0UID);
            res.end();
        });
    }
});
router.post("/findStoreByCustomFields", function (req, res) {
    var fieldList = req.body;
    if (!fieldList) {
        ErrorObject_1.ErrorObject.BAD_REQUEST.send(res);
    }
    else {
        Store_1.Store.findByCustomFields(fieldList).then(function (resultFindByCustomFields) {
            res.send(resultFindByCustomFields);
            res.end();
        });
    }
});
router.get("/findOrderIDbyUUID/orderID/:orderID", function (req, res) {
    var orderID = req.params.orderID;
    Order_1.Order.findUUIDbyOrderId(orderID).then(function (resultfindUUIDbyOrderId) {
        res.send(resultfindUUIDbyOrderId);
        res.end();
    });
});
router.post("/validateGBPayToken", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, resultValidateGBPayToken, tokenStatus, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.body.token;
                if (!!token) return [3 /*break*/, 1];
                throw ErrorObject_1.ErrorObject.NULL_OBJECT;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, validateGBPayToken(token)];
            case 2:
                resultValidateGBPayToken = _a.sent();
                tokenStatus = {
                    status: ""
                };
                if (resultValidateGBPayToken.resultCode === "00") {
                    tokenStatus["status"] = "VALID";
                }
                else {
                    tokenStatus["status"] = "INVALID";
                }
                res.send(tokenStatus);
                res.end();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                Log_1.Log.error("Error while validating GBPay token ", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getDefaultGBPayToken", function (req, res) {
    var tokenObj = {
        token: GBPay_1.GBPay.TOKEN
    };
    res.send(tokenObj);
    res.end();
});
router.post("/cryptData", function (req, res) {
    var secret_key = req.body.secret_key;
    var mode = req.body.mode;
    var data = req.body.data;
    if (!secret_key && mode && data) {
        throw new ErrorObject_1.ErrorObject("Required fields are missing", 400);
    }
    else {
        var cryptedData = Utils_1.Utils.cryptrManager(secret_key, mode, data);
        res.send({ data: cryptedData });
        res.end();
    }
});
router.post("/isWalletToken", function (req, res) {
    var walletToken = GBPay_1.GBPay.TOKEN.trim();
    var token = req.body.token.trim();
    var resultCheckWalletToken = false;
    if (walletToken === token) {
        resultCheckWalletToken = true;
    }
    res.send({ result: resultCheckWalletToken });
    res.end();
});
router.post("/pushFields", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, fieldPath, fieldObj, resultPushFields, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                type = req.body.type;
                fieldPath = req.body.fieldPath;
                fieldObj = req.body.fieldObj;
                return [4 /*yield*/, Utils_1.Utils.pushFields(type, fieldPath, fieldObj)];
            case 1:
                resultPushFields = _a.sent();
                res.send(resultPushFields);
                res.end();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                Log_1.Log.error("Error while pushing fields: ", error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
