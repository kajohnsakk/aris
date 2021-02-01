import * as Express from 'express';
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { Utils } from '../utils/Utils';
import { ApiProxy } from '../modules/ApiProxy';
import { ExternalProxy } from '../modules/ExternalProxy';

const router = Express.Router();

router.get('/', (req: any, res: any) => {
    res.render('./reporting/main');
});

router.get('/eventsByStore', (req: any, res: any) => {
    ApiProxy.getInstance().sendRequest("GET", "/reports/eventsByStoreID")
        .then((resultEventByStore: any) => {
            let renderObj = {
                data: resultEventByStore,
            }

            res.render('./reporting/eventsByStore', renderObj);
        })
        .catch((error: any) => {
            Log.error('Error while getting event by store : ', error);
            throw error;
        });
});

router.get('/orderByProduct', (req: any, res: any) => {
    let storeID = req.query.storeID;
    
    if (!storeID) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        ApiProxy.getInstance().sendRequest("GET", `/reports/orderByProduct?storeID=${storeID}`)
            .then((resultOrderByProduct: any) => {
                let sumOrderGrandTotal: number = Number(0);
                resultOrderByProduct.forEach((order: any) => {
                    if (order['orderInfo'].hasOwnProperty('orderTotal')) {
                        sumOrderGrandTotal += Number(order['orderInfo']['orderTotal']);
                    }
                });

                let renderObj = {
                    data: resultOrderByProduct,
                    sumOrderGrandTotal: sumOrderGrandTotal
                }
                res.render('./reporting/orderByProduct', renderObj);
            })
            .catch((error: any) => {
                Log.error('Error while getting order by product : ', error);
                throw error;
            })
    }
});

module.exports = router;