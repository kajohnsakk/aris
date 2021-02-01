export { };
import { IFundsTransaction, FundsTransaction } from '../models/FundsTransaction';
import { Log } from '../utils/Log';
import { ErrorObject } from '../utils/ErrorObject';

const express = require('express');
const router = express.Router();
const timeUuid = require('time-uuid');

router.get('/getFundsTransactionList', async (req: any, res: any) => {
    Log.debug('[FundsTransactionRouter] Sending req')
    Log.debug('==================== getFundsTransactionList ====================');
    Log.debug('req query is ', req.query);

    var file = '';
    var selectedStoreID = '';
    var startDate = 0;
    var endDate = 0;

    if (req.query.file && req.query.file.length > 0) {
        file = req.query.file;
    }

    if (req.query.selectedStoreID && req.query.selectedStoreID.length > 0) {
        selectedStoreID = req.query.selectedStoreID;
    }

    if (req.query.startDate && req.query.startDate > 0) {
        startDate = req.query.startDate;
    }

    if (req.query.endDate && req.query.endDate > 0) {
        endDate = req.query.endDate;
    }

    var resultFundsTransactionList: IFundsTransaction[] = await FundsTransaction.getFundsTransactionList(selectedStoreID, startDate, endDate);
    let resultData;
    if (file === 'csv') {
        var csvData = await FundsTransaction.convertJsonToCsv(resultFundsTransactionList);
        resultData = csvData;
    } else {
        resultData = resultFundsTransactionList;
    }

    res.send(resultData);
    res.end();
});

router.get('/orderID/:orderID', async (req: any, res: any) => {
	const orderID = req.params.orderID;
	Log.debug('Get funds transaction by orderID: '+orderID);
	
	var resultFundsTransaction: IFundsTransaction[] = await FundsTransaction.getFundsTransactionByOrderID(orderID);

    res.send(resultFundsTransaction);
    res.end();
});

router.post('/new', async (req: any, res: any) => {
	const fundsTransaction = req.body;
	
	const fundTransactionID = timeUuid();
	fundsTransaction['fundTransactionID'] = fundTransactionID;
	
	Log.debug('Creating new funds transaction with body: ', fundsTransaction);

    let updateObj = new FundsTransaction(fundsTransaction);
    res.send(fundTransactionID);
    res.end();
    return updateObj.update(fundsTransaction);
	
});

module.exports = router;