export { };

import { Log } from "../ts-utils/Log";
import { ErrorObject } from '../ts-utils/ErrorObject';

import { ICreditCard, CreditCard } from '../models/CreditCard';
import { GBPay, IRecurringApi, IResultRecurringApi } from '../models/GBPay';
import { Recurring, IRecurring } from '../models/Recurring';
import { RecurringManager } from '../models/RecurringManager';
import * as express from 'express';
import { Request, Response } from "express";
const timeUuid = require('time-uuid');

const router = express.Router();

router.get('/storeID/:storeID/current', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    CreditCard.findCurrentCreditCard(storeID).then((resultFindCurrentCreditCard) => {
        res.send(resultFindCurrentCreditCard);
        res.end();
    });
});

router.get('/storeID/:storeID', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    CreditCard.findCreditCardList(storeID).then((resultFindCreditCardList) => {
        res.send(resultFindCreditCardList);
        res.end();
    });
});

// router.post('/new', (req: Request, res: Response) => {
//     const creditCardID = timeUuid();
//     let insertData: ICreditCard = req.body;

//     insertData['creditCardID'] = creditCardID;
	
//     Log.debug('Insert credit card of storeID: ' + insertData.storeID + ' with: ', insertData);

//     let updateObj = new CreditCard(insertData, creditCardID);
//     res.send(updateObj.getUuid());
//     res.end();
//     return updateObj.update(insertData);

// });

router.post('/creditCardID/:creditCardID/update', (req: Request, res: Response) => {
    let creditCardID = req.params.creditCardID;
    let updateData: ICreditCard = req.body;

    Log.debug('Update credit card of creditCardID: ' + creditCardID + ' with: ', updateData);
    
    let updateObj = new CreditCard(updateData, creditCardID);
    let updateResult = updateObj.update(updateData);
    res.send(updateResult);
    res.end();
    
    return updateResult;
});

router.post('/new', (req: Request, res: Response) => {
    Log.debug('Add credit card with req.body => ', req.body);
    const creditCardInfo = req.body.creditCardInfo;
    const storeID = req.body.storeID;

    if ( !( 
        (creditCardInfo.hasOwnProperty('name') && creditCardInfo.name.length > 0) && 
        (creditCardInfo.hasOwnProperty('number') && creditCardInfo.number.length > 0) && 
        (creditCardInfo.hasOwnProperty('expirationMonth') && creditCardInfo.expirationMonth.length > 0) && 
        (creditCardInfo.hasOwnProperty('expirationYear') && creditCardInfo.expirationYear.length > 0) && 
        (creditCardInfo.hasOwnProperty('securityCode') && creditCardInfo.securityCode.length > 0)
    )) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        let request = {
            rememberCard: true,
            card: creditCardInfo
        };
        GBPay.generateCreditCardToken(request)
            .then((resultGenToken: { [key: string]: any }) => {
                if( resultGenToken.resultCode === "00" ) {
                    const token = resultGenToken.card.token;
                    const verifyInfo = {
                        resultCode: resultGenToken.resultCode
                    };

                    let creditCardObj = {...creditCardInfo};
                    creditCardObj['token'] = token;

                    const creditCardID = timeUuid();
                    const insertData: ICreditCard = {
                        creditCardID: creditCardID,
                        storeID: storeID,
                        creditCardInfo: creditCardObj,
                        verifyInfo: verifyInfo,
                        createdAt: Date.now(),
                        deletedAt: 0,
                        isDeleted: false
                    };

                    Log.debug('Insert credit card of storeID: ' + insertData.storeID + ' with: ', insertData);

                    let updateObj = new CreditCard(insertData, creditCardID);
                    res.send(updateObj.getUuid());
                    res.end();
                    return updateObj.update(insertData);

                } else {
                    res.send("false");
                    res.end();
                }

            });
    }

});


router.post('/delete', async (req: Request, res: Response) => {
    Log.debug('Delete credit card with req.body => ', req.body);
    const creditCardInfo = req.body.creditCardInfo;

    try {

        Log.debug('Process current reccurring.....');
        await RecurringManager.processRecurring(creditCardInfo);

        creditCardInfo['isDeleted'] = true;
        creditCardInfo['deletedAt'] = Date.now();
        let updateObj = new CreditCard(creditCardInfo, creditCardInfo.creditCardID);
        Log.debug('Delete previous credit card by update creditCardID: '+creditCardInfo.creditCardID+' with: ', creditCardInfo);
        let updateResult = updateObj.update(creditCardInfo);
        res.send(updateResult);
        res.end();

    } catch(error) {
        Log.debug('Fail to delete credit card with error => ', error);
        throw ErrorObject.INTERNAL_ERROR;
    }

});

router.post('/recurring', async (req: Request, res: Response) => {
    Log.debug('Recurring credit card with req.body => ', req.body);
    const creditCardInfo = req.body.creditCardInfo;
    const chargePrice = req.body.chargePrice;
    const selectedPackage = req.body.selectedPackage;
    const isDowngradePackage = req.body.isDowngradePackage;

    try {

        Log.debug('Prepare reccurring before send to GB Pay.....');
        const sentResult = await RecurringManager.sendRecurringToGbpay(creditCardInfo, chargePrice, selectedPackage, isDowngradePackage);

        res.send(sentResult);
        res.end();

    } catch(error) {
        Log.debug('Fail to recurring credit card with error => ', error);
        throw ErrorObject.INTERNAL_ERROR;
    }

});


module.exports = router;