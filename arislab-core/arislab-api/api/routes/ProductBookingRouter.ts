export { };
import * as express from "express";
import { Request, Response } from "express";
import { ProductBooking, IProductBooking, IVariationDetails } from '../models/ProductBooking';
import { ErrorObject } from '../ts-utils/ErrorObject';
import { Log } from '../ts-utils/Log';

const router = express.Router();
const timeUuid = require('time-uuid');

router.post('/new', (req: Request, res: Response) => {
    const productBookingID = timeUuid();
    const _15_MINUTES_FROM_NOW = new Date(Date.now() + (15 * 60 * 1000)).getTime();

    let updateData: IProductBooking;
    let requestBody = req.body as IProductBooking;

    requestBody['productBookingID'] = productBookingID;
    requestBody['isDeleted'] = false;
    requestBody['createdAt'] = Date.now();
    requestBody['startTimestamp'] = Date.now();
    requestBody['endTimestamp'] = _15_MINUTES_FROM_NOW;
    requestBody['deletedAt'] = 0;

    updateData = { ...requestBody };

    Log.debug('Creating new product booking with body: ', updateData);

    let updateObj = new ProductBooking(updateData, productBookingID);
    res.send(updateObj.getUuid());
    res.end();
    return updateObj.update(updateData);
});

router.post('/update', (req: Request, res: Response) => {
    const productBookingID = req.query.productBookingID;
    const _15_MINUTES_FROM_NOW = new Date(Date.now() + (15 * 60 * 1000)).getTime();

    let updateData: IProductBooking;
    let requestBody = req.body as IProductBooking;

    requestBody['productBookingID'] = productBookingID;
    requestBody['isDeleted'] = false;
    requestBody['startTimestamp'] = Date.now();
    requestBody['endTimestamp'] = _15_MINUTES_FROM_NOW;

    updateData = { ...requestBody };

    Log.debug('Updating product booking id ' + productBookingID + ' with body: ', updateData);

    res.sendStatus(200);
    res.end();

    let updateObj = new ProductBooking(updateData, productBookingID);
    return updateObj.save();
});

router.post('/delete', (req: Request, res: Response) => {
    const productBookingID = req.body.productBookingID;
    
    let updateData: IProductBooking;
    let requestBody = req.body as IProductBooking;

    requestBody['productBookingID'] = productBookingID;
    requestBody['isDeleted'] = true;
    requestBody['deletedAt'] = Date.now();
    
    updateData = { ...requestBody };

    Log.debug('Deleting product booking id ' + productBookingID + ' with body: ', updateData);

    res.sendStatus(200);
    res.end();

    let updateObj = new ProductBooking(updateData, productBookingID);
    return updateObj.save();
});

router.get('/details', (req: Request, res: Response) => {
    const productBookingID = req.query.productBookingID;

    if (!productBookingID) {
        throw new ErrorObject("productBookingID is required", 400);
    } else {
        ProductBooking.getProductBookingDetails(productBookingID)
            .then((resultGetProductBookingDetails: any) => {
                res.send(resultGetProductBookingDetails);
                res.end();
            });
    }
});

router.get('/findByCartID', (req: Request, res: Response) => {
    const cartID = req.query.cartID;

    if (!cartID) {
        throw new ErrorObject("cartID is required", 400);
    } else {
        ProductBooking.getProductBookingByCartID(cartID)
            .then((resultGetProductBookingByCartID: any) => {
                res.send(resultGetProductBookingByCartID);
                res.end();
            });
    }
});

router.post('/product/:productID/checkInventory', (req: Request, res: Response) => {
    const productID: string = req.params.productID;
    const requestBody = req.body as IVariationDetails;
    
    Log.debug(`Get product booking with productID: ${productID}, body: `, requestBody);
    
    if (!productID) {
        throw new ErrorObject("productID is required", 400);
    } else {
        ProductBooking.getProductBookingStock(productID, requestBody.color, requestBody.size)
            .then((resultGetProductBookingStock: any) => {
                res.send(resultGetProductBookingStock);
                res.end();
            });
    }

});

router.post('/cart/:cartID/product/:productID/checkInventory', (req: Request, res: Response) => {
    const cartID: string = req.params.cartID;
    const productID: string = req.params.productID;
    const requestBody = req.body as IVariationDetails;
    
    Log.debug(`Get product booking from cartID: ${cartID} with productID: ${productID}, body: `, requestBody);

    if (!cartID) {
        throw new ErrorObject("cartID is required", 400);
    } else if (!productID) {
        throw new ErrorObject("productID is required", 400);
    } else {
        ProductBooking.getProductBookingInCart(cartID, productID, requestBody.color, requestBody.size)
            .then((resultGetProductBookingStock: any) => {
                res.send(resultGetProductBookingStock);
                res.end();
            });
    }

});

module.exports = router;