export { };
import { IInvoice, Invoice } from '../models/Invoice';
import { Log } from '../utils/Log';
import { ErrorObject } from '../utils/ErrorObject';

const express = require('express');
const router = express.Router();
const timeUuid = require('time-uuid');
const bodyParser = require('body-parser');

router.get('/', async (req: any, res: any) => {
    Log.debug('==================== getAllInvoice ====================');

    var resultAllInvoice: IInvoice[] = await Invoice.getAllInvoice();

    res.send(resultAllInvoice);
    res.end();
});


module.exports = router;