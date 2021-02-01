export { };

import { Store } from '../models/Store';
import { Event } from '../models/Event';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Log } from '../ts-utils/Log';
import { ErrorObject } from '../ts-utils/ErrorObject';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get('/eventsByStoreID', async (req: Request, res: Response) => {
    try {
        Log.debug('Trying to get events by store id');
        let storeList = await Store.findAllStore();
        let storeAndEventResultList = storeList.map(async (store: any) => {
            let storeID = store['_id'];
            let name = store['_source']['storeInfo']['businessProfile']['accountDetails']['name'] || "";
            let email = store['_source']['email'] || "";
            let createdAt: number = store['_source']['createdAt'] || 0;
            let registeredTimestamp: number = store['_source']['registeredTimestamp'] || 0;
            let isPassedStepper: boolean = false;
            let isVisited: boolean = false;

            if (createdAt > 0) {
                isVisited = true;
            }

            if (registeredTimestamp !== 0) {
                isPassedStepper = true;
            }

            let liveEvent = await Event.findStoreEventList(storeID);

            let returnObj = {
                storeInfo: {
                    storeID: storeID,
                    name: name,
                    email: email,
                    createdAt: createdAt,
                    registeredTimestamp: registeredTimestamp
                },
                isVisited: isVisited,
                isPassedStepper: isPassedStepper,
                hasLiveEvent: false,
                eventInfo: {}
            }

            if (liveEvent.length > 0) {
                returnObj['hasLiveEvent'] = true;
                returnObj['eventInfo'] = {
                    eventCount: liveEvent.length,
                    eventList: liveEvent
                }

                return returnObj;
            }

            return returnObj;
        });

        return Promise.all(storeAndEventResultList)
            .then((storeAndEventResult: any) => {
                res.send(storeAndEventResult)
            })
    } catch (error) {
        Log.error('Error while getting events by store id : ', error);
        throw error;
    }
});

router.get('/orderByProduct', async (req: Request, res: Response) => {
    let storeID = req.query.storeID;

    if (!storeID) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        try {
            Log.debug("Getting order by product with storeID " + storeID);
            let productList = await Product.findById(storeID, true);
            let orderByProductResultList = productList.map(async (product: any) => {
                let productID = product['productID'];
                let productImage = product['productInfo']['productImage'];
                let productName = product['productInfo']['productName'];
                let individualProductType = product['productInfo']['individualProductType'];

                let ordersByProductID = await Order.findOrdersByProductID(storeID, productID);

                let returnObj = {
                    storeID: storeID,
                    productInfo: {
                        productID: productID,
                        productImage: productImage,
                        productName: productName,
                        individualProductType: individualProductType
                    },
                    hasOrder: false,
                    orderInfo: {}
                }
                                
                if (ordersByProductID.length > 0) {
                    let summary = {
                        totalEachOrder: 0
                    }
                    ordersByProductID.forEach((order) => {
                        summary['totalEachOrder'] += order['summary']['grandTotal']
                    });

                    returnObj['hasOrder'] = true;
                    returnObj['orderInfo'] = {
                        orderCount: ordersByProductID.length,
                        orderTotal: summary['totalEachOrder'],
                        orderList: ordersByProductID
                    }

                    return returnObj;
                    
                }

                return returnObj;
            });

            return Promise.all(orderByProductResultList)
                .then((orderByProductResultList: any) => {
                    res.send(orderByProductResultList);
                });
        } catch (error) {
            Log.error("Error while getting order by product of storeID :" + storeID + " with error: ", error);
            throw error;
        }
    }
});

module.exports = router;