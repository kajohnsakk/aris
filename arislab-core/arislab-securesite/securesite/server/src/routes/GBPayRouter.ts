import * as Express from 'express';
import { Request, Response } from "express";
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { Payment } from '../models/Payment';

const router = Express.Router();
const multer = require('multer');
const upload = multer();

router.post('/handleChargeCard', upload.array(), (req: Request, res: Response) => {
    Log.debug('[handleChargeCard]')
    res.send(req.body);
    res.end();
});

module.exports = router;