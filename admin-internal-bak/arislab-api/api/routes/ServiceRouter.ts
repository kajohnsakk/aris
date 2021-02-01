import * as Express from 'express';
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { StoreManager } from '../models/StoreManager';
import { Request, Response } from "express";
import { GBPay } from '../models/GBPay';
import { StorePackage } from '../models/StorePackage';
import { Order } from '../models/Order';

const timeUuid = require('time-uuid');
const router = Express.Router();

const bodyParser = require('body-parser')
router.use(bodyParser.json({limit: '10mb'}));

router.get('/stores', (req: any, res: any) => {
    StoreManager.getAllStore()
        .then((resultListAllStore) => {
            res.send(resultListAllStore);
            res.end();
        });
});

router.get('/store', (req: any, res: any) => {
    let from = req.query.from || 0;
    let showAll = req.query.showAll || false;
    let promise;

    if (from !== null || from !== undefined && from >= 0) {
        promise = StoreManager.listAllStore(from);
    }

    if (showAll) {
        promise = StoreManager.listAllStore();
    }

    promise.then((resultListAllStore) => {
        res.send(resultListAllStore);
        res.end();
    });
});

router.get('/storeInfo', (req: any, res: any) => {
    const storeID = req.query.storeID;
    StoreManager.getStoreInfoByStoreID(storeID)
        .then((resultStoreInfoByStoreID) => {
            res.send(resultStoreInfoByStoreID);
            res.end();
        });
});

router.post('/verifyToken', (req: Request, res: Response) => {
    let token = req.body.token;
    GBPay.verifyToken(token)
        .then((resultGenerateGBLink: any) => {
            res.send(resultGenerateGBLink);
            res.end();
        });
});

router.get('/tokenList', (req: Request, res: Response) => {
    StoreManager.retrieveTokenList()
        .then((resultRetrieveTokenList) => {
            res.send(resultRetrieveTokenList);
            res.end();
        });
});

router.get('/storePackage', (req: any, res: any) => {
	const storeID = req.query.storeID;
	
	if( storeID !== undefined && storeID.length > 0 ) {
		StorePackage.getStorePackageByStoreID(storeID)
			.then((resultStorePackageByStoreID) => {
				res.send(resultStorePackageByStoreID);
				res.end();
			});
	} else {
		StorePackage.getCurrentStorePackage()
			.then((resultCurrentStorePackage) => {
				res.send(resultCurrentStorePackage);
				res.end();
			});
	}
    
});

router.get('/storePackageInfo', (req: any, res: any) => {
	const storePackageID = req.query.storePackageID;
	
	if( storePackageID !== undefined && storePackageID.length > 0 ) {
		StorePackage.getStorePackageInfoByStorePackageID(storePackageID)
			.then((resultStorePackageInfoByStorePackageID) => {
				res.send(resultStorePackageInfoByStorePackageID);
				res.end();
			});
	} else {
		res.send();
		res.end();
	}
	
});

router.get('/storePackage/:storePackageID/delete', (req: any, res: any) => {
	const storePackageID = req.params.storePackageID;
	
	res.send(StorePackage.deleteStorePackageByStorePackageID(storePackageID));
	res.end();
    
});



router.post('/storePackage/new', (req: Request, res: Response) => {
    let storePackage = req.body;
	
	const storePackageID = timeUuid();
	storePackage['storePackageID'] = storePackageID;
	
	Log.debug('Creating new store package with body: ', storePackage);

    let updateObj = new StorePackage(storePackage, storePackageID);
    res.send(storePackageID);
    res.end();
    return updateObj.update(storePackage);
    
});

router.post('/storePackage/storePackageID/:storePackageID/update', (req: Request, res: Response) => {
    let storePackageID = req.params.storePackageID;
	let storePackage = req.body;
	
	Log.debug('Update store package of storePackageID: '+storePackageID+' with body: ', storePackage);

    let updateObj = new StorePackage(storePackage, storePackageID);
    res.send(storePackageID);
    res.end();
    return updateObj.update(storePackage);
    
});

module.exports = router;