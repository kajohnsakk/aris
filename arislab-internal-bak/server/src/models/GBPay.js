"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../utils/Log");
const ExternalProxy_1 = require("../modules/ExternalProxy");
const Utils_1 = require("./Utils");
class GBPay {
    static verifyToken(data) {
        let initGBPayData = {
            token: data,
            amount: 1,
            referenceNo: `R_${Utils_1.Utils.randomString(13, "N")}`,
            payType: "F",
            cardUse: "Y",
            billUse: "N",
            qrUse: "Y",
            expire: 30,
            deliveryMethod: "0",
            multipleUse: "N",
            responseUrl: "https//dev.arislab.ai/webhook",
            backgroundUrl: "https//dev.arislab.ai/webhook",
            customerName: "test name",
            customerEmail: "test email",
            customerAddress: "test address",
            customerTelephone: "0809992222",
            detail: "",
            merchantDefined1: "",
            merchantDefined2: ""
        };
        return ExternalProxy_1.ExternalProxy.getInstance().sendRequest({
            uri: "https://api.gbprimepay.com/gbp/gateway/link",
            method: "POST",
            body: initGBPayData
        })
            .then((resultLink) => {
            Log_1.Log.debug('Generated gbpay link of body ', initGBPayData, ' result is: ', resultLink);
            return Promise.resolve(resultLink);
        })
            .catch((err) => {
            Log_1.Log.error('Error while generating gbpay link: ', err + ' , body: ', data);
            return Promise.reject(err);
        });
    }
}
exports.GBPay = GBPay;
//# sourceMappingURL=GBPay.js.map