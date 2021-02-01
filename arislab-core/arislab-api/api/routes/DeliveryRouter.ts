export { };

import { Log } from "../ts-utils/Log";

import { JSONData as DeliveryJSON, Delivery } from '../models/Delivery';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get('/storeID/:storeID/', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    Delivery.findById(storeID).then((resultFindByID) => {
        res.send(resultFindByID);
        res.end();
    });
});

router.post('/storeID/:storeID/update', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('sections is ', req.params.sections);
    Log.debug('req.body is', req.body);
    let storeID = req.params.storeID;

    let updateData: DeliveryJSON;
	
    // let chargeTypeData = req.body.storeInfo.delivery.chargeType;
    let priceData = req.body.price;
    
    updateData = {
        storeID: storeID,
        storeInfo: {
            delivery: {
				// chargeType: chargeTypeData,
				price: priceData
            }
        }
    }

    Log.debug('update data is ', JSON.stringify(updateData));
    res.end();
    
    let updateObj = new Delivery(updateData);
    return updateObj.update(updateData);
});

// router.post('/storeID/:storeID/sections/:sections/update', (req: Request, res: Response) => {
//     Log.debug('storeID is ', req.params.storeID);
//     Log.debug('sections is ', req.params.sections);
//     Log.debug('req.body is', req.body);
//     let sections = req.params.sections;
//     let storeID = req.params.storeID;

//     let updateData: JSONData;

//     if (sections === "PRIVACY_POLICY") {
//         let privacyPolicyData = req.body.storeInfo.policies.privacyPolicy;

//         updateData = {
//             storeID: storeID,
//             storeInfo: {
//                 policies: {
//                     privacyPolicy: privacyPolicyData,
//                 }
//             }
//         }
//     } else if (sections === "RETURN_REFUND_POLICY") {
//         let returnRefundPolicyData = req.body.storeInfo.policies.returnRefundPolicy;
        
//         updateData = {
//             storeID: storeID,
//             storeInfo: {
//                 policies: {
//                     returnRefundPolicy: returnRefundPolicyData,
//                 }
//             }
//         }
//     } else if (sections === "SHIPPING_POLICY") {
//         let shippingPolicyData = req.body.storeInfo.policies.shippingPolicy;
        
//         updateData = {
//             storeID: storeID,
//             storeInfo: {
//                 policies: {
//                     shippingPolicy: shippingPolicyData,
//                 }
//             }
//         }
//     } else if (sections === "CANCELLATION_POLICY") {
//         let cancellationPolicyData = req.body.storeInfo.policies.cancellationPolicy;
        
//         updateData = {
//             storeID: storeID,
//             storeInfo: {
//                 policies: {
//                     cancellationPolicy: cancellationPolicyData,
//                 }
//             }
//         }
//     }

//     Log.debug('update data is ', JSON.stringify(updateData));
//     res.end();
    
//     let updateObj = new Delivery(updateData);
//     return updateObj.update(updateData);
// });

module.exports = router;