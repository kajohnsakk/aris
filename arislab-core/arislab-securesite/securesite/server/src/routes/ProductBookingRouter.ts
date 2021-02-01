import * as Express from 'express';
import { Request, Response } from "express";
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { ProductBookingManager } from '../models/ProductBookingManager';

const router = Express.Router();

router.post('/new', (req: Request, res: Response) => {
    const productBookingInfo = req.body;

    if (!productBookingInfo) {
        throw new ErrorObject("Required fields are missing", 400);
    } else {
        ProductBookingManager.createProductBooking(productBookingInfo).then((result) => {
            res.send(result);
            res.end();
        });
    }
});

module.exports = router;