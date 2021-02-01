import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { ExternalProxy } from '../modules/ExternalProxy';
import { Utils } from '../utils/Utils';

const querystring = require('querystring');
const Cryptr = require('cryptr');
const URL_SECRET_KEY = new Cryptr('@R!$LAB_SECURESITE');

export interface GBPayData {
    token: string,
    amount: Number,
    referenceNo: string,
    payType: string,
    cardUse: string,
    billUse: string,
    qrUse: string,
    expire: Number,
    deliveryMethod: string,
    multipleUse: string,
    responseUrl: string,
    backgroundUrl: string,
    customerName?: string,
    customerEmail?: string,
    customerAddress?: string,
    customerTelephone?: string,
    detail?: string,
    merchantDefined1?: string,
    merchantDefined2?: string,
    merchantDefined3?: string,
    merchantDefined4?: string,
    merchantDefined5?: string
}

export interface inputGBPayDataJSON {
    token?: string,
    amount?: number,
    referenceNo?: string,
    cardUse?: string,
    qrUse?: string,
    responseUrl?: string,
    backgroundUrl?: string,
    customerName?: string,
    customerEmail?: string,
    customerAddress?: string,
    customerTelephone?: string,
    merchantDefined1?: string,
    merchantDefined2?: string,
    merchantDefined3?: string,
    merchantDefined4?: string,
    merchantDefined5?: string
}

export interface IGBPayLinkResponseObject {
    resultCode: string,
    [key: string]: any
}

export class Payment {
    public static async generateGBPayLink(data: inputGBPayDataJSON) {
        const initGBPayData: GBPayData = {
            token: data['token'],
            amount: data['amount'],
            referenceNo: data['referenceNo'],
            payType: "F",
            cardUse: data['cardUse'] || "Y",
            billUse: "N",
            qrUse: data['qrUse'] || "N",
            expire: 30,
            deliveryMethod: "0",
            multipleUse: "N",
            responseUrl: data['responseUrl'],
            backgroundUrl: data['backgroundUrl'],
            customerName: data['customerName'] || "",
            customerEmail: data['customerEmail'] || "",
            customerAddress: data['customerAddress'] || "",
            customerTelephone: data['customerTelephone'] || "",
            detail: "",
            merchantDefined1: data['merchantDefined1'] || "",
            merchantDefined2: data['merchantDefined2'] || "",
            merchantDefined3: data['merchantDefined3'] || "",
            merchantDefined4: data['merchantDefined4'] || "",
            merchantDefined5: data['merchantDefined5'] || ""
        };

        try {
            const resultGBPayLink = await ApiProxy.getInstance().sendRequest("POST", `/gbpay/generateGBPayLink`, {
                data: initGBPayData
            });
            Log.debug('Result generated gbpay link of body: ', initGBPayData, '  is: ', resultGBPayLink);
            return Promise.resolve(resultGBPayLink);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    public static getReturningUser(userID: string, storeID?: string, orderID?: string) {
        return ApiProxy.getInstance().sendRequest("POST", `/order/checkReturningUser`, {
            userID: userID,
            storeID: storeID,
            orderID: orderID
        })
            .then((resultReturningUser: any) => {
                return Promise.resolve(resultReturningUser);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    public static getUserGBPayToken(storeID: string) {
        return ApiProxy.getInstance().sendRequest("GET", `/payment/storeID/${storeID}`)
            .then((resultUserGBPayToken: any) => {
                return Promise.resolve(resultUserGBPayToken)
            })
            .catch((err) => {
                return Promise.reject(err);
            })
    }

    public static validateGBLinkData(gbLinkData: IGBPayLinkResponseObject) {
        if (gbLinkData['resultCode'] !== "00") {
            gbLinkData = null;
        }
        return gbLinkData;
    }

    public static async checkProductInventory(storeID: string, productID: string, color?: string, size?: string) {
        try {
            const resultCheckProductInventory = await ApiProxy.getInstance().sendRequest("POST", `/product/storeID/${storeID}/product/${productID}/checkInventory`, {
                color: color,
                size: size
            });
            return Promise.resolve(resultCheckProductInventory);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    public static encodePaymentURL(inputData: { url: string, storeID: string, orderID: string, referenceNo: string }) {
        let data = {
            url: inputData['url'],
            storeID: inputData['storeID'],
            orderID: inputData['orderID'],
            referenceNo: inputData['referenceNo']
        };
        let encryptedData = URL_SECRET_KEY.encrypt(JSON.stringify(data));

        return `${process.env.WEB_URL}site/link/open?data=${encryptedData}`;
    }

    public static getDefaultGBPayToken() {
        Log.debug('Getting default gbpay token');
        return ApiProxy.getInstance().sendRequest("GET", "/utility/getDefaultGBPayToken")
            .then((resultDefaultGBPayToken: { token: string }) => {
                return Promise.resolve(resultDefaultGBPayToken);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    public static async postToWebhook(data: { [key: string]: any }) {
        Log.debug('Posting to webhook with data: ', data);
        try {
            const resultPostToWebhook = await ExternalProxy.getInstance().sendRequest({
                method: "POST",
                uri: process.env.PAYMENT_WEBHOOK_URL,
                body: data,
                resolveWithFullResponse: true
            });

            Log.debug('Posted to webhook with return statuscode: ', resultPostToWebhook.statusCode);

            return Promise.resolve(resultPostToWebhook.statusCode);
        } catch (error) {
            Log.error('Error while posting to webhook with: ', error);
            return Promise.reject(error);
        }
    }

    public static async createQRCode(data: inputGBPayDataJSON) {
        Log.debug('Creating new qrcode with body: ', data);
        try {
            const form = {
                "token": data['token'] || process.env.DEFAULT_GB_PAY_TOKEN,
                "amount": data['amount'],
                "referenceNo": data['referenceNo'] || `N_${Utils.randomString(13, "N")}`,
                "backgroundUrl": process.env.PAYMENT_WEBHOOK_URL,
                "customerName": data['customerName'],
                "customerEmail": data['customerEmail'],
                "customerAddress": data['customerAddress'],
                "customerTelephone": data['customerTelephone'],
                "merchantDefined1": data['merchantDefined1'],
                "merchantDefined2": data['merchantDefined2'],
                "merchantDefined3": data['merchantDefined3'],
                "merchantDefined4": data['merchantDefined4']
            };
            const formData = querystring.stringify(form);

            const resultCreateQRCode = await ExternalProxy.getInstance().sendRequest({
                method: "POST",
                uri: `${process.env.GB_PAY_GATEWAY}gbp/gateway/qrcode`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                encoding: null,
                body: formData
            });

            Log.debug('QRCode was created successfully with result: ', resultCreateQRCode);

            return Promise.resolve(resultCreateQRCode);
        } catch (error) {
            Log.error('Error while creating new qrcode: ', error);
            return Promise.reject(error);
        }
    }

    // public static async chargeCard(data: { [key: string]: any }) {
    //     Log.debug('Charging new card with request data: ', data);
    //     try {
    //         const resultChargeCard = await ApiProxy.getInstance().sendRequest({

    //         });
    //         return Promise.resolve();
    //     } catch (error) {
    //         Log.debug('Error while charging card: ', error);
    //         return Promise.reject(error);
    //     }
    // }
}