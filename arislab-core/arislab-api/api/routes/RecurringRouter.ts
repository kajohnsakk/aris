export { };

import { Log } from "../ts-utils/Log";
import { ErrorObject } from '../ts-utils/ErrorObject';

import { Recurring, IRecurring } from '../models/Recurring';
import { RecurringManager } from '../models/RecurringManager';
import * as express from 'express';
import { Request, Response } from "express";
const timeUuid = require('time-uuid');

const router = express.Router();

router.get('/recurringNo/:recurringNo', (req: Request, res: Response) => {
    let recurringNo = req.params.recurringNo;
    Recurring.findRecurringByRecurringNo(recurringNo).then((resultFindRecurring) => {
        res.send(resultFindRecurring);
        res.end();
    });
});

router.post('/recurringID/:recurringID/sections/:sections/update', (req: Request, res: Response) => {
    let recurringID = req.params.recurringID;
    let sections = req.params.sections;

    Log.debug('update recurring with section')
    Log.debug('recurringID is ', recurringID);
    Log.debug('sections is ', sections);
    
    let updateData: IRecurring;

    if (sections === "STORE_PACKAGE") {
        const storePackageID = req.body.data.storePackageID;

        updateData = {
            recurringID: recurringID,
            storePackageID: storePackageID
        }
    }

    Log.debug('update data is ', JSON.stringify(updateData));
    res.send({ status:"success" });
    res.end();
    
    let updateObj = new Recurring(updateData, recurringID);
    return updateObj.update(updateData);
});

router.post('/recurringInfo/update', async (req: Request, res: Response) => {
    const storeID = req.body.storeID;
    const currentRecurringInfo = req.body.currentRecurringInfo;
    const newRecurringInfo = req.body.newRecurringInfo;

    Log.debug('Update recurring of storeID: ' + storeID + ' from: ', currentRecurringInfo, ' to: ', newRecurringInfo);
    const updateResult = await RecurringManager.updateRecurring(storeID, currentRecurringInfo, newRecurringInfo);
    Log.debug('Result from update recurring is: ', updateResult);

    res.send(updateResult);
    res.end();
    
});


module.exports = router;