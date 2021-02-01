export { };
import { EventTransaction, IEventTransaction } from '../models/EventTransaction';
import uuidv4 from 'uuid/v4';
import { Log } from '../ts-utils/Log';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();
const timeUuid = require('time-uuid');

router.get('/code/:code/list', (req: Request, res: Response) => {
    let code = req.params.code;
    EventTransaction.findEventTransactionFromEventCode(code).then((resultFindByCode: IEventTransaction[]) => {
        res.send(resultFindByCode);
        res.end();
    });
});

router.get('/code/:code/last', (req: Request, res: Response) => {
    let code = req.params.code;
    EventTransaction.findLastEventTransactionFromEventCode(code).then((resultFindByCode: IEventTransaction[]) => {
        res.send(resultFindByCode);
        res.end();
    });
});


module.exports = router;