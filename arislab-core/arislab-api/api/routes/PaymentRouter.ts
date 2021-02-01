export { };

import { Log } from "../ts-utils/Log";

import { JSONData as PaymentJSON, Payment } from '../models/Payment';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get('/storeID/:storeID/', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    Payment.findById(storeID).then((resultFindByID) => {
        res.send(resultFindByID);
        res.end();
    });
});

router.post('/storeID/:storeID/update', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('req.body is', req.body);
    let storeID = req.params.storeID;

    let updateData: PaymentJSON;

    let bankData = req.body.storeInfo.paymentInfo.bank;
    let accountName = req.body.storeInfo.paymentInfo.accountName;
    let accountNumber = req.body.storeInfo.paymentInfo.accountNumber;
    let qrImage = req.body.storeInfo.paymentInfo.qrImage;
    let token = req.body.storeInfo.paymentInfo.gbPayInfo.token;
    let verifyInfo = req.body.storeInfo.paymentInfo.verifyInfo;

    updateData = {
        storeID: storeID,
        storeInfo: {
            paymentInfo: {
                bank: bankData,
                accountName: accountName,
                accountNumber: accountNumber,
                gbPayInfo: {
                    token: token
                },
                qrImage: qrImage,
                verifyInfo: verifyInfo
            }
        }
    };

    Log.debug('update data is ', JSON.stringify(updateData));
    res.end();
    
    let updateObj = new Payment(updateData);
    return updateObj.update(updateData);
});

module.exports = router;