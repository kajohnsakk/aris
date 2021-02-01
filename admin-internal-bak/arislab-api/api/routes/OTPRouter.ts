import * as Express from 'express';
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { OTP } from '../models/OTP';
import { Request, Response } from "express";

const router = Express.Router();

router.post('/findByRef', (req: Request, res: Response) => {
    const refCode = req.body.refCode;

    OTP.findOTPByRef(refCode)
        .then((resultFindOTPByRef: any) => {
            let tempResult = {};
            tempResult['found'] = false;
            if (resultFindOTPByRef.length > 0) {
                tempResult['found'] = true;
                tempResult['result'] = resultFindOTPByRef[0];
            }
            res.send(tempResult);
            res.end();
        });
});

module.exports = router;