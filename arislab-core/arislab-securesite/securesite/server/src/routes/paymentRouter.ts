import * as Express from 'express';
import { Request, Response } from "express";
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';
import { Utils } from '../utils/Utils';
import { ApiProxy } from '../modules/ApiProxy';
import { PaymentCharger } from '../components/PaymentCharger';
import { ExternalProxy } from '../modules/ExternalProxy';
import { Payment, inputGBPayDataJSON } from '../models/Payment';
import { OrderManager } from '../models/OrderManager';

const router = Express.Router();

const RESPONSE_URL = process.env.PAYMENT_RESPONSE_URL;
const WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL;

if (!RESPONSE_URL) {
    Log.error("No RESPONSE_URL defined");
    throw ErrorObject.NULL_OBJECT;
}

if (!WEBHOOK_URL) {
    Log.error("No WEBHOOK_URL defined");
    throw ErrorObject.NULL_OBJECT;
}

router.post('/webhook', (req: Request, res: Response) => {
    Log.debug('------ BEGIN WEBHOOK ------')
    Log.debug(req.body);
    Log.debug('------ FINISH WEBHOOK ------')
});

router.get('/checkout/complete', (req: Request, res: Response) => {
    let data: any;
    res.render('checkoutComplete', { data: data })
});

// router.post('/checkout/complete', (req: any, res: any) => {
//     let responseData = req.body;

//     // Forward data to webhook
//     Log.info('Forwarding payment response to webhook with response ', responseData);

//     return ExternalProxy.getInstance().sendRequest({
//         uri: WEBHOOK_URL,
//         method: "post",
//         body: responseData
//     })
//         .then((resultForwardData: any) => {
//             Log.info('resultForwardData ', resultForwardData);
//             res.render('checkoutComplete')
//         })
//         .catch((error: any) => {
//             Log.error('Error while forwarding payment response to webhook ', error);
//         });
// });

router.post('/checkout/result', (req: Request, res: Response) => {
    let paymentResponseData = req.body;
    
    Log.debug('Checkout completed with response data is ', paymentResponseData);

    let sixDigitsOrderID = paymentResponseData['merchantDefined1'];
    let orderID = paymentResponseData['merchantDefined2'];

    ApiProxy.getInstance().sendRequest("GET", `/order/findByOrderDocID?orderID=${orderID}`)
        .then(async (resultOrderInfo: any) => {
            try {
                if (resultOrderInfo) {
                    let data: any = resultOrderInfo;

                    if (paymentResponseData['resultCode'] === "00") {
                        let renderObj = {
                            data: data
                        }
                        res.render('checkoutComplete', renderObj);
                    } else {
                        let errorDetails = `There's a error while processing your payment. (Error Code: ${paymentResponseData['resultCode']})`
                        let renderObj = {
                            showDetails: true,
                            details: errorDetails
                        }
                        res.render('error', renderObj)
                    }
                }
            } catch (error) {
                Log.error('Error while finding order by document id: ' + orderID);
                throw error;
            }
        })
});

router.get('/storeID/:storeID/order/:orderID', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let orderID = req.params.orderID;

    ApiProxy.getInstance().sendRequest("GET", `/order/storeID/${storeID}/orderID/${orderID}`)
        .then(async (resultOrderInfo: any) => {
            try {
                if (resultOrderInfo.length > 0) {
                    // If order exists
                    let data: any = resultOrderInfo[0];

                    if (data['paymentInfo']['status'] === "SUCCESS") {
                        let renderObj = {
                            data: data
                        }
                        res.render('checkoutComplete', renderObj);
                    } else if (data['paymentInfo']['status'] === "PENDING") {
                        let storeInfoObj = await Payment.getUserGBPayToken(storeID);
                        let userGBPayToken = storeInfoObj['storeInfo']['paymentInfo']['gbPayInfo']['token'];
                        let GBPayLinkDataObj = {};
                        let defaultGBPayToken = await Payment.getDefaultGBPayToken();

                        if (userGBPayToken) {
                            let updateBody = { "recipientAccountType": "MERCHANT_BANK_ACCOUNT" }
                            if (userGBPayToken === defaultGBPayToken['token']) {
                                updateBody['recipientAccountType'] = "GB_PAY_WALLET";
                            }

                            let resultUpdateOrder = await OrderManager.updateOrderByID(data['customFields']['_id'], storeID, updateBody);
                            Log.debug('resultUpdateOrder ', resultUpdateOrder);
                        }

                        /*
                            Final check of product inventory
                            Iterate over selectedProduct in order object first
                        */

                        let iterateSelectedProduct = new Promise((resolve, reject) => {
                            data['selectedProduct'].forEach(async (product: any, index: number) => {
                                try {
                                    Log.debug('checking productID ' + product['productID'] + 'is out of stock or not');
                                    let productColor = "";
                                    let productSize = "";
                                    let productPrice = Number(product['productValue']['price']);

                                    if (product['productValue']['colorObj'].hasOwnProperty('value') && product['productValue']['colorObj']['value']) {
                                        productColor = product['productValue']['colorObj']['value'];
                                    }

                                    if (product['productValue']['size']) {
                                        productSize = product['productValue']['size'];
                                    }

                                    if (product['productValue']['size'] === "__COLOR_ONLY__") {
                                        product['productValue']['isColorOnly'] = true;
                                    } else {
                                        product['productValue']['isColorOnly'] = false;
                                    }

                                    let remainingStock = await Payment.checkProductInventory(storeID, product['productID'], productColor, productSize);
                                    Log.debug('productID ' + product['productID'] + ' total remaining stock is: ', remainingStock)

                                    if (remainingStock['stock'] > 0) {
                                        product['isInStock'] = true;
                                    } else {
                                        product['isInStock'] = false;
                                    }

                                    data['selectedProduct'][index]['isInStock'] = product['isInStock'];

                                    /*
                                        Subtract total summary by product that out of stock
                                        For example: Total summary is 120 and has two product (e.g. productA (price: 20), productB (price: 100))
                                        If product A is out of stock, this code below will subtract total summary by 20.
                                        In the end, total summary will be 100
                                    */
                                    if (data['selectedProduct'][index]['isInStock'] === false) {
                                        Log.debug('productID ' + product['productID'] + ' is out of stock, subtracting total price by ' + productPrice);

                                        data['summary']['totalPrice'] = data['summary']['totalPrice'] - productPrice;
                                        data['summary']['grandTotal'] = data['summary']['grandTotal'] - productPrice;
                                    }


                                    if (index === data['selectedProduct'].length - 1) {
                                        resolve();
                                    }
                                } catch (error) {
                                    reject(error);
                                    throw error;
                                }
                            });
                        });

                        // Wait for iteration is done
                        iterateSelectedProduct.then(async () => {
                            // Init body for gbpay create link api
                            let gbInputData: inputGBPayDataJSON;
                            gbInputData = {
                                token: userGBPayToken,
                                amount: data['summary']['grandTotal'],
                                referenceNo: `N_${Utils.randomString(13, "N")}`,
                                responseUrl: RESPONSE_URL,
                                backgroundUrl: WEBHOOK_URL,
                                merchantDefined1: data['orderID'],
                                merchantDefined2: data['customFields']['_id'],
                                merchantDefined3: data['storeID'],
                                merchantDefined4: data['cartID']
                            }

                            Log.debug('grandtotal is ', data['summary']['grandTotal']);
                            Log.debug('gbInputData is ', gbInputData);

                            if (data['summary']['totalPrice'] <= 0) {
                                // If all products in this order out of stock
                                // Set gbInputData amount to 0 to prevent hitting Pay button
                                Log.debug('All products in this order are out of stock, setting gbInputData amount to 0');

                                gbInputData['amount'] = 0;

                                Log.debug('Current gbInputData is: ', gbInputData);
                            }

                            let defaultGBPayLinkData = await Payment.generateGBPayLink(gbInputData);
                            defaultGBPayLinkData = Payment.validateGBLinkData(defaultGBPayLinkData);

                            GBPayLinkDataObj['defaultLink'] = defaultGBPayLinkData;

                            Log.debug('defaultGBPayLinkData', defaultGBPayLinkData)

                            // Overwrite GBPayLink with securesite link tracking
                            if (
                                GBPayLinkDataObj['defaultLink'] &&
                                GBPayLinkDataObj['defaultLink'].hasOwnProperty('resultCode') &&
                                GBPayLinkDataObj['defaultLink']['resultCode'] === "00"
                            ) {
                                let encodeData = {
                                    url: GBPayLinkDataObj['defaultLink']['gbLinkUrl'],
                                    storeID: data['storeID'],
                                    orderID: data['customFields']['_id'],
                                    referenceNo: GBPayLinkDataObj['defaultLink']['referenceNo']
                                }
                                Log.debug(`GBPayLinkDataObj['defaultLink']`, GBPayLinkDataObj['defaultLink'])
                                GBPayLinkDataObj['defaultLink']['gbLinkUrl'] = Payment.encodePaymentURL(encodeData)
                            }

                            // Is returning user?
                            let resultReturningUser = await Payment.getReturningUser(data['userID'], data['storeID']);

                            Log.debug('resultReturningUser', resultReturningUser);

                            if (resultReturningUser['isReturningUser']) {
                                // If this user is a returning user, retrive previous info
                                Log.debug('This user id ' + data['userID'] + ' is a returning user, setting input data...');

                                gbInputData['referenceNo'] = `R_${Utils.randomString(13, "N")}`;
                                gbInputData['customerName'] = resultReturningUser['additionalDetails']['customerName'];
                                gbInputData['customerEmail'] = resultReturningUser['additionalDetails']['customerEmail']
                                gbInputData['customerAddress'] = resultReturningUser['additionalDetails']['customerAddress']
                                gbInputData['customerTelephone'] = resultReturningUser['additionalDetails']['customerTelephone']

                                // Fill retrived info and create new pre-filled link
                                Log.debug('Setting data has been done, sending request to generate gbpay link with data: ', gbInputData);

                                let returningUserGBPayLinkData = await Payment.generateGBPayLink(gbInputData);
                                returningUserGBPayLinkData = Payment.validateGBLinkData(returningUserGBPayLinkData);

                                GBPayLinkDataObj['prefilledLink'] = returningUserGBPayLinkData;

                                // Overwrite GBPayLink with securesite link tracking
                                // if (GBPayLinkDataObj['prefilledLink']['resultCode'] === "00") {
                                    
                                if (
                                    GBPayLinkDataObj['prefilledLink'] &&
                                    GBPayLinkDataObj['prefilledLink'].hasOwnProperty('resultCode') &&
                                    GBPayLinkDataObj['prefilledLink']['resultCode'] === "00"
                                ) {
                                    let encodeData = {
                                        url: GBPayLinkDataObj['prefilledLink']['gbLinkUrl'],
                                        storeID: data['storeID'],
                                        orderID: data['customFields']['_id'],
                                        referenceNo: GBPayLinkDataObj['prefilledLink']['referenceNo']
                                    }
                                    Log.debug(`GBPayLinkDataObj['prefilledLink']`, GBPayLinkDataObj['prefilledLink']);
                                    GBPayLinkDataObj['prefilledLink']['gbLinkUrl'] = Payment.encodePaymentURL(encodeData)
                                }
                            }

                            let renderObj = {
                                data: data,
                                GBPayLinkData: GBPayLinkDataObj,
                                resultReturningUser: resultReturningUser
                            }
                            res.render('payment', renderObj);
                            Log.info('[GET][PaymentRouter] Rendering with renderObj: ', renderObj);
                        });
                    }
                    
                } else {
                    // If order not found, render error page with "Order not found" message
                    let renderObj = {
                        showDetails: true,
                        details: 'Order not found!'
                    }
                    res.render('error', renderObj)
                }
            } catch (error) {
                Log.error('Error while rendering paymentRouter with ', error);
                throw error;
            }
        });
});

router.post('/checkout', (req: Request, res: Response) => {
    const host = req.protocol + "://" + req.get('host');

    let token = req.body.omiseToken;
    let source = req.body.omiseSource;

    let amount = req.body.form_amount;
    let description = req.body.form_description;

    if (token.length > 0) {
        Log.debug('!token', token);
        
        let redirectURL = host + "/site/payment/checkout/complete";

        PaymentCharger.getInstance().chargeCard(amount, description, token, redirectURL)
            .then((resultChargeCard: any) => {
                Log.debug('[post] /checkout chargeCard result ', resultChargeCard)
                if (resultChargeCard.hasOwnProperty('authorize_uri')) {
                    res.redirect(resultChargeCard.authorize_uri);
                } else {
                    Log.debug('req.body is ', req.body);
                    res.send('[post] /checkout');
                    res.end();
                }
            })
            .error((err: any) => {
                Log.error('[post] /checkout chargeCard error ', err)
            });
    } else {
        Log.debug('!source', source);

        let redirectURL = host + "/site/payment/checkout/complete";

        PaymentCharger.getInstance().chargeInternetBanking(amount, description, source, redirectURL)
            .then((resultChargeInternetBanking: any) => {
                Log.debug('[post] /checkout chargeInternetBanking result ', resultChargeInternetBanking)
                if (resultChargeInternetBanking.hasOwnProperty('authorize_uri')) {
                    res.redirect(resultChargeInternetBanking.authorize_uri);
                } else {
                    Log.debug('req.body is ', req.body);
                    res.send('[post] /checkout');
                    res.end();
                }
            })
            .error((err: any) => {
                Log.error('[post] /checkout chargeInternetBanking error ', err)
            });
    }
});

module.exports = router;