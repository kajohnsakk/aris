export { };

import { Log } from "../ts-utils/Log";
import { ErrorObject } from '../ts-utils/ErrorObject';

import { JSONData as StoreConfigJSON, StoreConfig } from '../models/StoreConfig';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get('/storeID/:storeID/', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    StoreConfig.findById(storeID).then((resultFindByID) => {
        res.send(resultFindByID);
        res.end();
    });
});

router.post('/storeID/:storeID/update', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('sections is ', req.params.sections);
    Log.debug('req.body is', req.body);
    let storeID = req.params.storeID;

    let updateData: StoreConfigJSON;
	
    let useCartData = req.body.config.useCart;
    let useCashOnDeliveryData = req.body.config.useCashOnDelivery;
    let useCreditCardData = req.body.config.useCreditCard;
    let enabledEditProductHashtag = req.body.config.enabledEditProductHashtag;
    let refLink = req.body.config.refLink;
    
    updateData = {
        storeID: storeID,
        storeInfo: {
            config: {
                useCart: useCartData,
                useCashOnDelivery: useCashOnDeliveryData,
                useCreditCard: useCreditCardData,
                enabledEditProductHashtag: enabledEditProductHashtag,
                refLink: refLink
            }
        }
    }

    Log.debug('update data is ', JSON.stringify(updateData));
    res.end();
    
    let updateObj = new StoreConfig(updateData);
    return updateObj.update(updateData);
});

router.post('/tokenList', (req: Request, res: Response) => {
    const storeList = req.body.storeList || [];

    StoreConfig.retrieveTokenList(storeList)
        .then((resultRetrieveTokenList) => {
            res.send(resultRetrieveTokenList);
            res.end();
        });
});

router.post('/findByToken', (req: Request, res: Response) => {
    const token = req.body.token;

    if (!token) {
        ErrorObject.BAD_REQUEST.send(res);
    } else {
        StoreConfig.findByToken(token)
            .then((resultFindByToken) => {
                res.send(resultFindByToken);
                res.end();
            });
    }
});

module.exports = router;