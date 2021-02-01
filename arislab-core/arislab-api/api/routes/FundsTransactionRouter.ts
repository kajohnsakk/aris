export { };
import * as express from 'express';
import { Request, Response } from "express";
import { IFundsTransaction, FundsTransaction } from '../models/FundsTransaction';
// import { ErrorObject } from '../ts-utils/ErrorObject';
import { Log } from '../ts-utils/Log';

const router = express.Router();
const timeUuid = require('time-uuid');

router.post('/new', (req: Request, res: Response) => {
    const fundTransactionID = timeUuid();
    let updateData: IFundsTransaction;
    let requestBody = req.body;

    requestBody['fundTransactionID'] = fundTransactionID;

    updateData = { ...requestBody };

    Log.debug('Creating new funds transaction with body: ', updateData);

    let updateObj = new FundsTransaction(updateData, fundTransactionID);
    res.send(updateObj.getUuid());
    res.end();
    return updateObj.update(updateData);
});

router.post('/delete', (req: Request, res: Response) => {
    const id = req.query.id

    let updateData: IFundsTransaction;
    let requestBody = req.body as IFundsTransaction;

    requestBody['isDeleted'] = true;
    requestBody['deletedAt'] = Date.now();

    updateData = { ...requestBody };

    Log.debug('Deleting funds transaction id: ' + id + ' with body:', updateData);

    res.sendStatus(200);
    res.end();

    const updateObj = new FundsTransaction(updateData, id);
    return updateObj.save();
});

router.get("/storeID/:storeID/", (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let type = req.query.type ? req.query.type : '' ;
    let startDate = req.query.startDate ? req.query.startDate : 0 ;
    let endDate = req.query.endDate ? req.query.endDate : 0;
    
    FundsTransaction.findById(storeID, type, startDate, endDate).then(resultFindByID => {
        res.send(resultFindByID);
        Log.debug(resultFindByID);
        res.end();
    });
});

router.get("/orderID/:orderID/", (req: Request, res: Response) => {
    let orderID = req.params.orderID;
    FundsTransaction.findByOrderId(orderID).then(result => {
        res.send(result);
        Log.debug(result);
        res.end();
    });
});

module.exports = router;