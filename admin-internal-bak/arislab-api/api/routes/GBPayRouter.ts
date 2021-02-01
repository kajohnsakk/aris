import * as Express from 'express';
import { Request, Response } from "express";
import { GBPay } from '../models/GBPay';

const router = Express.Router();

router.post('/verifyToken', (req: Request, res: Response) => {
    let token = req.body.token;
    GBPay.verifyToken(token)
        .then((resultGenerateGBLink: any) => {
            res.send(resultGenerateGBLink);
            res.end();
        });
});

module.exports = router;