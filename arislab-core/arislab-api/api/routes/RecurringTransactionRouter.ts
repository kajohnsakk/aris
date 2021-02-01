export { };

import { Log } from "../ts-utils/Log";
import { ErrorObject } from '../ts-utils/ErrorObject';

import { RecurringTransaction, IRecurringTransaction } from '../models/RecurringTransaction';
import * as express from 'express';
import { Request, Response } from "express";
const timeUuid = require('time-uuid');

const router = express.Router();

router.post('/new', (req: Request, res: Response) => {
    const recurringTransactionID = timeUuid();
    let insertData: IRecurringTransaction = req.body;

    insertData['recurringTransactionID'] = recurringTransactionID;
	
    Log.debug('Insert recurring transaction with data: ', insertData);

    let resultObj = new RecurringTransaction(insertData, recurringTransactionID);
    res.send(resultObj.getUuid());
    res.end();
    return resultObj.update(insertData);
});


module.exports = router;