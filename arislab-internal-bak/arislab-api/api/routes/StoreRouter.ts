export { };
import { IStore, Store } from '../models/Store';
import { Log } from '../utils/Log';
import { ErrorObject } from '../utils/ErrorObject';

const express = require('express');
const router = express.Router();
const timeUuid = require('time-uuid');

router.get('/getStoreList', async (req: any, res: any) => {
    Log.debug('==================== getStoreList ====================');
    Log.debug('req query is ', req.query);
    
    var file = '';
    var startDate = 0;
    var endDate = 0;
    
	if (req.query.file && req.query.file.length > 0) {
        file = req.query.file;
    }
    if (req.query.startDate && req.query.startDate > 0) {
        startDate = req.query.startDate * 1000;
    }
    if (req.query.endDate && req.query.endDate > 0) {
        endDate = req.query.endDate * 1000;
    }
    

    var resultAllStore: IStore[] = await Store.getStoreList(startDate, endDate);
    let resultData;
    if( file === 'csv' ) {
        //var csvData = await Store.convertJsonToCsv(resultAllStore);
        //resultData = csvData;
		resultData = resultAllStore;
    } else {
        resultData = resultAllStore;
    }

    res.send(resultData);
    res.end();
});

module.exports = router;