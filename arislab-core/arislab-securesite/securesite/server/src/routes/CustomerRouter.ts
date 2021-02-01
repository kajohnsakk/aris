import * as Express from 'express';
import { Request, Response } from "express";
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { CustomerManager } from '../models/CustomerManager';

const router = Express.Router();

router.post('/setCustomerInfo', async (req: Request, res: Response) => {
    const requestBody = req.body;
    Log.debug('Set costomer info req.body: ', req.body);
    if (!requestBody) {
        Log.debug('Set costomer info with no req.body');
        throw new ErrorObject("Request body is missing", 400);
    } else {
        try {
            const resultCheckCustomerExists = await CustomerManager.checkCustomerExists(requestBody['storeID'], requestBody['userID']);
            let resultSetCustomer;
            if (resultCheckCustomerExists['exists']) {
                resultSetCustomer = await CustomerManager.updateCustomer(requestBody);
            } else {
                resultSetCustomer = await CustomerManager.createNewCustomer(requestBody);
            }

            if (resultSetCustomer) {
                res.send({ status: "created" });
                res.end();
            }

        } catch (error) {
            Log.error('Error while setting customer info with: ', error);
            throw error;
        }
    }
});

module.exports = router;