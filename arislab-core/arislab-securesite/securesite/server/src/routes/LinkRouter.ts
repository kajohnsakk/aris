import * as Express from 'express';
import { Request, Response } from "express";
import { Log } from "../utils/Log";
import { ErrorObject } from "../utils/ErrorObject";
import { ApiProxy } from "../modules/ApiProxy";
// import { ExternalProxy } from "../modules/ExternalProxy";
// import { CartManager } from '../models/CartManager';
// import { CustomerManager } from '../models/CustomerManager';
// import { StoreManager } from '../models/StoreManager';
// import { ChannelManager } from '../models/ChannelManager';
// import { Payment } from '../models/Payment';
import { OrderManager } from '../models/OrderManager';

const router = Express.Router();
const Cryptr = require('cryptr');
const URL_SECRET_KEY = new Cryptr('@R!$LAB_SECURESITE');
const gbPayapiserverEndpoint: string = process.env.GB_PAY_GATEWAY || "https://api.gbprimepay.com/";

let qrcodeRender = {};

router.get('/deepLinkRedirect', (req: Request, res: Response) => {
    let target = req.query.target;

    if (!target) {
        throw new ErrorObject("Target fields can't be empty", 400);
    } else {
        Log.debug('Redirecting to deep link with target: ', target);
        target = decodeURIComponent(target);
        res.redirect(`${target}`);
    }
});

router.get('/open', (req: Request, res: Response) => {
    const data = req.query.data;

    if (!req.query.data) {
        ErrorObject.BAD_REQUEST.send(res);
        return;
    } else {
        Log.debug('[Securesite][LinkRouter] Opening link with encrypted data: ' + data);

        const decryptedData = JSON.parse(URL_SECRET_KEY.decrypt(data));
        const destination = decryptedData['url'];
        const storeID = decryptedData['storeID'];
        const orderID = decryptedData['orderID'];
        const referenceNo = decryptedData['referenceNo'];

        Log.debug('[Securesite][LinkRouter] Decrypted data is: ', decryptedData);

        const defaultRedirectURL = process.env.DEFAULT_REDIRECT_URL || "about:blank";

        const updateBody = {
            paymentInfo: {
                pressedPayBtnTimestamp: Date.now(),
                referenceNo: referenceNo,
                gbPayLink: destination
            }
        }

        Log.debug('[Securesite][LinkRouter] Updating clicked pay button timestamp of orderID: ' + orderID + ' in storeID: ' + storeID + ' with body: ', updateBody);

        ApiProxy.getInstance().sendRequest("POST", `/order/storeID/${storeID}/orderID/${orderID}/update`, updateBody)
            .then((resultUpdateClickedPayButton: any) => {
                Log.debug('[Securesite][LinkRouter] Updated clicked pay button timestamp with result: ', resultUpdateClickedPayButton);
                Log.debug('[Securesite][LinkRouter] Redirecting to url: ' + destination);
                res.redirect(destination);
            })
            .catch((error) => {
                Log.error('Error while update clicked pay button timestamp with: ', error);
                res.redirect(defaultRedirectURL);
            });
    }

});

router.get('/paymentRedirect', async (req: Request, res: Response) => {
    const encodedCartID = req.query.id;
    const redirectType = req.query.redirectType;

    if (!encodedCartID) {
        ErrorObject.BAD_REQUEST.send(res);
        return;
    } else {
        const resultRedirect = await OrderManager.doRedirectAction(encodedCartID, 'PAYMENT', redirectType);
        const defaultRedirectURL = process.env.DEFAULT_REDIRECT_URL || "about:blank";

        if (resultRedirect['isPaymentActionDone']) {
            if (resultRedirect['paymentMethod'] === "CARD") {
                res.redirect(resultRedirect['result']['response']);
            } else if (resultRedirect['paymentMethod'] === "QR") {
                qrcodeRender[encodedCartID] = {
                    qrcodeImg: resultRedirect['result']['response'],
                    timestamp: Date.now()
                };
                let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                fullUrl = fullUrl.replace('paymentRedirect','qrcodeRedirect');
                fullUrl = fullUrl.replace('&redirectType=QR','');
                res.redirect(fullUrl);
            }
        } else {
            res.redirect(defaultRedirectURL);
        }
    }
});

router.get('/qrcodeRedirect', (req: Request, res: Response) => { 
    const encodedCartID = req.query.id;
    const qrcodeRenderRedirect = qrcodeRender[encodedCartID];
    res.render('new/qrcode', qrcodeRenderRedirect);
})

router.get('/cashOnDeliveryRedirect', async (req: Request, res: Response) => {
    const encodedCartID = req.query.id;

    if (!encodedCartID) {
        ErrorObject.BAD_REQUEST.send(res);
        return;
    } else {
        const resultRedirect = await OrderManager.doRedirectAction(encodedCartID, 'COD');
        const defaultRedirectURL = process.env.DEFAULT_REDIRECT_URL || "about:blank";
        if (resultRedirect['isCodActionDone']) {
            const renderObj = {
                "status": resultRedirect['isCodActionDone'],
                "cod": resultRedirect['cod']
            };
            res.render('new/status', renderObj);
        } else {
            res.redirect(defaultRedirectURL);
        }
    }
});

module.exports = router;