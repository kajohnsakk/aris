export { };
import * as express from "express";
import { Request, Response } from "express";
import { Cart, ICart, ISelectedProductJSON } from '../models/Cart';
import { ErrorObject } from '../ts-utils/ErrorObject';
import { Log } from '../ts-utils/Log';

const router = express.Router();
const timeUuid = require('time-uuid');

router.post('/new', (req: Request, res: Response) => {
    const cartID = timeUuid();

    let updateData: ICart;
    let requestBody = req.body;

    requestBody['cartID'] = cartID;

    updateData = { ...requestBody };

    Log.debug('Creating new cart with body: ', updateData);

    let updateObj = new Cart(updateData, cartID);
    res.send({ "_id": updateObj.getUuid() });
    res.end();
    return updateObj.update(updateData);
});

router.post('/update', (req: Request, res: Response) => {
    let cartID = req.query.cartID

    let updateData: ICart;
    let requestBody = req.body;

    updateData = { ...requestBody };

    Log.debug('Updating cartID ' + cartID + ' with body: ', updateData);

    res.sendStatus(200);
    res.end();

    let updateObj = new Cart(updateData, cartID);
    return updateObj.save();
});

router.get('/details', (req: Request, res: Response) => {
    let cartID = req.query.cartID;

    Cart.getCartDetails(cartID)
        .then((resultCartDetails: any) => {
            res.send(resultCartDetails);
            res.end();
        });
});

router.post('/checkUserCartExists', (req: Request, res: Response) => {
    let userID = req.body.userID;
    let oneClickBuy = req.body.oneClickBuy || false;

    if (!userID) {
        throw new ErrorObject("userID is required", 400);
    } else {
        Cart.checkUserCartExists(userID, oneClickBuy)
            .then((resultCheckUserCartExists: any) => {
                res.send(resultCheckUserCartExists);
                res.end();
            });
    }
});

router.post('/updateCartItem', (req: Request, res: Response) => {
    let cartID = req.query.cartID;
    let mode = req.query.mode;
    let productInfo = req.body as ISelectedProductJSON;

    if (!cartID && productInfo && mode) {
        throw new ErrorObject("Required fields are missing", 400);
    } else {
        Cart.updateItemInCart(cartID, productInfo, mode.toUpperCase())
            .then((resultUpdateItemInCart: any) => {
                res.send(resultUpdateItemInCart);
                res.end();
            });
    }
});

router.post('/updateCartProductData', (req: Request, res: Response) => {
    let cartID = req.query.cartID;
    let productInfo = req.body as ISelectedProductJSON;

    if (!(cartID && productInfo)) {
        throw new ErrorObject("Required fields are missing", 400);
    } else {
        Cart.updateProductDataInCart(cartID, productInfo)
            .then((resultUpdateItemInCart: any) => {
                res.send(resultUpdateItemInCart);
                res.end();
            });
    }
});

router.post('/removeCartItem', (req: Request, res: Response) => {
    let cartID = req.query.cartID;
    let productInfo = req.body as ISelectedProductJSON;

    if (!cartID && productInfo) {
        throw new ErrorObject("Required fields are missing", 400);
    } else {
        Cart.removeItemFromCart(cartID, productInfo)
            .then((resultRemoveItemFromCart: any) => {
                res.send(resultRemoveItemFromCart);
                res.end();
            });
    }
});

module.exports = router;