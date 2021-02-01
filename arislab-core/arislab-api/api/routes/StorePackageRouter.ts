export { };

import { Log } from "../ts-utils/Log";
import { ErrorObject } from '../ts-utils/ErrorObject';

import { IStorePackage, StorePackage, IPackageInfo } from '../models/StorePackage';
import { Channel } from '../models/Channel';
import * as express from 'express';
import { Request, Response } from "express";
const timeUuid = require('time-uuid');

const router = express.Router();

router.get('/storeID/:storeID/current', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    StorePackage.findCurrentStorePackage(storeID).then((resultFindCurrentPackage) => {
        res.send(resultFindCurrentPackage);
        res.end();
    });
});

router.get('/storePackageID/:storePackageID', (req: Request, res: Response) => {
    let storePackageID = req.params.storePackageID;
    StorePackage.findStorePackageByID(storePackageID).then((resultFindStorePackage) => {
        res.send(resultFindStorePackage);
        res.end();
    });
});

router.get('/storeID/:storeID/next', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    StorePackage.findNextStorePackage(storeID).then((resultFindNextPackage) => {
        res.send(resultFindNextPackage);
        res.end();
    });
});

router.get('/storeID/:storeID/last', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    StorePackage.findLastStorePackage(storeID).then((resultFindCurrentPackage) => {
        res.send(resultFindCurrentPackage);
        res.end();
    });
});

router.get('/storeID/:storeID', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    StorePackage.findStorePackageList(storeID).then((resultFindStorePackageList) => {
        res.send(resultFindStorePackageList);
        res.end();
    });
});

router.post('/new', (req: Request, res: Response) => {
    const storePackageID = timeUuid();
    let insertData: IStorePackage = req.body;

    insertData['storePackageID'] = storePackageID;
	
    Log.debug('Insert store package of storeID: ' + insertData.storeID + ' with: ', insertData);

    let updateObj = new StorePackage(insertData, storePackageID);
    res.send(updateObj.getUuid());
    res.end();
    return updateObj.update(insertData);

});

router.post('/createDotplayPackage/:facebookid', async (req: Request, res: Response) => {
    const storePackageID = timeUuid();
    let facebookid: String = req.params.facebookid;
    let store: any = await Channel.findChannelByPageId(facebookid);
    if(!store){
        res.send("failed")
        return({
            status: "failed"
        })
    }
    let storeID: string = store.storeID;
    let packageInfo: IPackageInfo = {
        name: "Dotplay",
        code: "005",
        description: "",
        isSubscribePackage: false,
        memberPrice: 0,
        activeDays: 30,
        billingInfo: {
          billingType: "",
          billingDate: 0
        },
        feeInfo: {
            service: {
                feeName: "SERVICE",
                charge: 4,
                chargeType: "PERCENT"
              },
              qrCodeService: {
                feeName: "QR_CODE",
                charge: 1,
                chargeType: "PERCENT"
              },
              creditCardService: {
                feeName: "CREDIT_CARD",
                charge: 2.9,
                chargeType: "PERCENT"
            }
        },
        note: "DotplayXAris"    
    }
    let insertData: IStorePackage = {
        storePackageID: storePackageID,
        storeID: storeID,
        packageInfo: packageInfo,
        status: "ACTIVE",
        createdAt: Date.now(),
        updatedAt: 0,
        activeDate: Date.now(),
        expiryDate: Date.now() + 2592000000
    }

    let updateObj = new StorePackage(insertData, storePackageID);
    res.send(updateObj);
    res.end();
    return {
        status: "success",
        data: updateObj.update(insertData)
    };
})

router.post('/storePackageID/:storePackageID/update', (req: Request, res: Response) => {
    let storePackageID = req.params.storePackageID;
    let updateData: IStorePackage = req.body;

    Log.debug('Update store package of storePackageID: ' + storePackageID + ' with: ', updateData);
    
    let updateObj = new StorePackage(updateData, storePackageID);
    let updateResult = updateObj.update(updateData);
    res.send(updateResult);
    res.end();
    
    return updateResult;
});

module.exports = router;