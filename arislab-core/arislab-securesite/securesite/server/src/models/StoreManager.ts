import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { ExternalProxy } from '../modules/ExternalProxy';
import { AsyncForEach } from '../utils/AsyncForEach';
import { CartManager } from './CartManager';
import { IStore } from './interfaces/Store';

export class StoreManager {
    public static async getStoreDetails(storeID: string) {
        Log.debug('[StoreManager] Getting store details of storeID: ' + storeID);
        try {
            let resultStoreDetails = await ApiProxy.getInstance().sendRequest("GET", `/storeConfig/storeID/${storeID}`);

            Log.debug('[StoreManager] Store details of storeID: ', resultStoreDetails);
            return Promise.resolve(resultStoreDetails);
        }
        catch (err) {
            Log.error('[StoreManager] Error while getting store details: ', err);
            return Promise.reject(err);
        }
    }

    public static async getSalesChannelDetails(storeID: string) {
        Log.debug('[StoreManager] Getting sales channels details of storeID: ' + storeID);
        try {
            let resultSalesChannelDetails = await ApiProxy.getInstance().sendRequest("GET", `/channels/storeID/${storeID}/details`);

            Log.debug('Sales channels details of storeID: ', resultSalesChannelDetails);
            return Promise.resolve(resultSalesChannelDetails);
        }
        catch (err) {
            Log.error('[StoreManager] Error while getting sales channels details: ', err);
            return Promise.reject(err);
        }
    }

    public static filterServiceConfig(type: string, serviceConfigObj: { [key: string]: any }) {
        return serviceConfigObj.filter((config: { [key: string]: any }) => {
            return config.type === type;
        });
    }

    public static async sendServiceConfigRequest(method: string, uri: string, body?: { [key: string]: any }) {
        Log.debug('[StoreManager] Sending service config request with method: ' + method + ' to url: ' + uri + ' with body ', body);
        try {
            const resultSendServiceConfigRequest = await ExternalProxy.getInstance().sendRequest({
                uri: uri,
                method: method,
                body: body || {}
            });

            Log.debug('[StoreManager] resultSendServiceConfigRequest', resultSendServiceConfigRequest);

            return Promise.resolve(resultSendServiceConfigRequest);
        } catch (error) {
            Log.error('[StoreManager] Error while sending service config request to with error: ', error);
            return Promise.reject(error);
        }
    }

    public static async checkServiceConfig(serviceConfig: Array<{ [key: string]: any }>, cartDetails: { [key: string]: any }, customerDetails: { [key: string]: any }) {
        let resultCheckServiceConfig: Array<{ [key: string]: any }>;

        // Set service config to resultCheckServiceConfig first
        resultCheckServiceConfig = serviceConfig;

        Log.debug('[StoreManager][checkServiceConfig] Adding index to each config...');
        await AsyncForEach.foreach(serviceConfig, async (config: { [key: string]: any }) => {
            // Add index to each obj in array
            Log.debug('[StoreManager][checkServiceConfig] Adding index to config: ', config);
            config['index'] = this.findIndexOfServiceConfigByName(config['name'], serviceConfig);
        });

        Log.debug('[StoreManager][checkServiceConfig] Add index to each config done');

        // Filter service config with type equals to API
        const apiServiceConfig = this.filterServiceConfig("API", serviceConfig);

        if (apiServiceConfig) {
            const resultInitApiService = await this.initApiServiceConfig(apiServiceConfig, cartDetails, customerDetails);

            if (resultInitApiService && resultInitApiService.length > 0) {
                Log.debug('[StoreManager] Iterating over result init api service...')
                // Set result api request to resultCheckServiceConfig with specific index position
                await AsyncForEach.foreach(resultInitApiService, async (resultConfig: { [key: string]: any }) => {
                    Log.debug('[StoreManager] Init Api service done, merging response with previous service config ', resultConfig);
                    resultCheckServiceConfig[resultConfig['index']] = resultConfig;

                    Log.debug('[StoreManager] Initializing default discount');

                    let deliveryDiscount = Number(0);
                    let amountDiscount = Number(0);
                    let totalDiscount = Number(0);

                    let updateCartBody = {
                        "discount": {
                            "totalDeliveryCost": deliveryDiscount,
                            "totalPrice": amountDiscount,
                            "grandTotal": totalDiscount
                        }
                    }

                    if (resultConfig['result']['isMember']) {
                        Log.debug('[StoreManager] This user is member, setting discount...');
                        
                        deliveryDiscount = Number(resultConfig['result']['discount']['deliveryCharge']);
                        amountDiscount = Number(resultConfig['result']['discount']['amount']);
                        totalDiscount = Number(deliveryDiscount + amountDiscount);
                        
                        updateCartBody['discount']['totalDeliveryCost'] = deliveryDiscount;
                        updateCartBody['discount']['totalPrice'] = amountDiscount;
                        updateCartBody['discount']['grandTotal'] = totalDiscount;

                        Log.debug('[StoreManager] This result config returned with isMember status: true, updating cartID: ' + cartDetails['cartID'] + ' with body: ', updateCartBody);
                    }

                    const resultUpdateCart = await CartManager.updateCart(updateCartBody, cartDetails['cartID']);
                    Log.debug('[StoreManager] resultUpdateCart ', resultUpdateCart);
                });
            }
        }

        return resultCheckServiceConfig;
    }

    public static reduceSelectedProductFields(selectedProduct: Array<{ [key: string]: any }>) {
        return selectedProduct.map((product: { [key: string]: any }) => {
            return {
                "name": product['productName'],
                "price": product['productValue']['price'],
                "quantity": product['availableQuantity']
            }
        });
    }

    public static findIndexOfServiceConfigByName(name: string, serviceConfigObj: { [key: string]: any }) {
        return serviceConfigObj.findIndex((config: { [key: string]: any }) => {
            return config.name === name;
        });
    }

    public static async initApiServiceConfig(apiServiceConfig: Array<{ [key: string]: any }>, cartDetails: { [key: string]: any }, customerDetails: { [key: string]: any }) {
        Log.debug('[StoreManager][initApiServiceConfig] Initializing API service config body for sending request');
        const productList = this.reduceSelectedProductFields(cartDetails['selectedProduct']);

        let serviceConfigReqObj = {
            "referenceNo": Date.now(),
            "customer": {
                "name": customerDetails['customerName'],
                "email": customerDetails['customerEmail'],
                "phoneNumber": customerDetails['customerPhoneNo'],
                "address": customerDetails['customerAddress'],
                "subDistrict": customerDetails['customerAddressDetails']['subDistrict'],
                "district": customerDetails['customerAddressDetails']['district'],
                "province": customerDetails['customerAddressDetails']['province'],
                "postalCode": customerDetails['customerAddressDetails']['postalCode']
            },
            "order": {
                "product": productList,
                "delivery": {
                    "firstPiece": cartDetails['deliveryCost']['firstPiece'],
                    "nextPiece": cartDetails['deliveryCost']['nextPiece']
                },
                "summary": {
                    "amount": cartDetails['summary']['totalPrice'],
                    "deliveryCharge": cartDetails['summary']['totalDeliveryCost']
                }
            }
        }

        Log.debug('[StoreManager][initApiServiceConfig] Api service config: ', apiServiceConfig);

        await AsyncForEach.foreach(apiServiceConfig, async (apiReq: { [key: string]: any }) => {
            apiReq['result'] = await this.sendServiceConfigRequest(apiReq['userDefined1'], apiReq['value'], eval(apiReq['userDefined2']));
        });

        return apiServiceConfig;
    }

    public static hasServiceConfig(storeDetails: { [key: string]: any }) {
        return storeDetails.hasOwnProperty('serviceConfig');
    }
}