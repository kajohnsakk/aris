export { };
import { IOrder, Order } from '../models/Order';
import { Log } from '../utils/Log';
import { ErrorObject } from '../utils/ErrorObject';

const express = require('express');
const router = express.Router();
const timeUuid = require('time-uuid');
const bodyParser = require('body-parser');

router.get('/getAllOrder', async (req: any, res: any) => {
    Log.debug('==================== getAllOrder ====================');
    Log.debug('req query is ', req.query);

    var file = '';
    var selectedStoreID = '';
    var selectedStatus = '';
    var startDate = 0;
    var endDate = 0;

    if (req.query.file && req.query.file.length > 0) {
        file = req.query.file;
    }
    if (req.query.selectedStoreID && req.query.selectedStoreID.length > 0) {
        selectedStoreID = req.query.selectedStoreID;
    }
    if (req.query.selectedStatus && req.query.selectedStatus.length > 0) {
        selectedStatus = req.query.selectedStatus;
    }
    if (req.query.startDate && req.query.startDate > 0) {
        startDate = req.query.startDate;
    }
    if (req.query.endDate && req.query.endDate > 0) {
        endDate = req.query.endDate;
    }


    var resultAllOrder: IOrder[] = await Order.findAllOrder(selectedStoreID, selectedStatus, startDate, endDate);
    let resultData;
    if (file === 'csv') {
        var csvData = await Order.convertJsonToCsv(selectedStoreID, resultAllOrder);
        resultData = csvData;
    } else {
        resultData = resultAllOrder;
    }

    res.send(resultData);
    res.end();
});

router.get('/orderID/:orderID', (req: any, res: any) => {
	const orderID = req.params.orderID;
	
	Order.findOrderBySelection('orderID', orderID).then((resultOrderList) => {
            res.send(resultOrderList);
            res.end();
        });
	
});

router.post('/orderDocID/:orderDocID/update', (req: any, res: any) => {

	const orderDocID = req.params.orderDocID;
	const updateData = req.body;
	
    Log.debug('Update order orderDocID: '+orderDocID+' with ', updateData);

    let updateObj = new Order(updateData, orderDocID);
	updateObj.update(updateData);
	const result = { "resultCode": "00", "detail": "" };
	res.send( result );
	res.end();
    
});

module.exports = router;