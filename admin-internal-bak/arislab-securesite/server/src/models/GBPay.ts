import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { ExternalProxy } from '../modules/ExternalProxy';
import { Utils } from './Utils';

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
    merchantDefined2?: string
}

export interface inputGBPayDataJSON {
    token: string,
    amount: number,
    referenceNo: string,
    responseUrl: string,
    backgroundUrl: string,
    customerName?: string,
    customerEmail?: string,
    customerAddress?: string,
    customerTelephone?: string,
    merchantDefined1?: string,
    merchantDefined2?: string
}

export class GBPay {
    public static verifyToken(data: any) {
        let initGBPayData: GBPayData = {
            token: data,
            amount: 1,
            referenceNo: `R_${Utils.randomString(13, "N")}`,
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
        }

        return ExternalProxy.getInstance().sendRequest({
            uri: "https://api.gbprimepay.com/gbp/gateway/link",
            method: "POST",
            body: initGBPayData
        })
            .then((resultLink: any) => {
                Log.debug('Generated gbpay link of body ', initGBPayData, ' result is: ', resultLink)
                return Promise.resolve(resultLink);
            })
            .catch((err: any) => {
                Log.error('Error while generating gbpay link: ', err + ' , body: ', data);
                return Promise.reject(err);
            });
    }
}