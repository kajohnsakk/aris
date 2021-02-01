import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface IVariationDetails {
    color: string,
    size: string
}

export interface IAddressDetails {
    district: string,
    subDistrict: string,
    province: string,
    postalCode: string
}

export interface IUserInfo {
    firstName: string,
    lastName: string
}

export interface ICustomerInfo {
    userID: string,
    userInfo: IUserInfo,
    customerName: string,
    customerEmail: string,
    customerPhoneNo: string,
    customerAddress: string,
    customerAddressDetails: IAddressDetails
}

export interface IProductBooking {
    productBookingID: string,
    cartID: string,
    productID: string,
    hasVariation: boolean,
    variationDetails: IVariationDetails,
    customerInfo: ICustomerInfo,
    quantity: number,
    startTimestamp: number,
    endTimestamp: number,
    createdAt: number,
    isDeleted: boolean,
    deletedAt: number
}

export class ProductBooking extends AbstractPersistentModel {
    public productBookingID: string;
    public cartID: string;
    public productID: string;
    public hasVariation: boolean;
    public variationDetails: IVariationDetails;
    public customerInfo: ICustomerInfo;
    public quantity: number;
    public startTimestamp: number;
    public endTimestamp: number;
    public createdAt: number;
    public isDeleted: boolean;
    public deletedAt: number;

    constructor(json: IProductBooking, productBookingID?: string) {
        super(productBookingID);
        this.productBookingID = json.productBookingID;
        this.cartID = json.cartID;
        this.productID = json.productID;
        this.hasVariation = json.hasVariation;
        this.variationDetails = json.variationDetails;
        this.customerInfo = json.customerInfo;
        this.quantity = json.quantity;
        this.startTimestamp = json.startTimestamp;
        this.endTimestamp = json.endTimestamp;
        this.createdAt = json.createdAt;
        this.isDeleted = json.isDeleted;
        this.deletedAt = json.deletedAt;
    }

    doUpdate(json: IProductBooking): boolean {
        return true;
    }

    private static readonly TYPE = "product_booking";
    protected getType(): string {
        return ProductBooking.TYPE;
    }

    public toJSON(): any {
        return {
            productBookingID: this.productBookingID,
            cartID: this.cartID,
            productID: this.productID,
            hasVariation: this.hasVariation,
            variationDetails: this.variationDetails,
            customerInfo: this.customerInfo,
            quantity: this.quantity,
            startTimestamp: this.startTimestamp,
            endTimestamp: this.endTimestamp,
            createdAt: this.createdAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt
        }
    }

    public static getProductBookingDetails(productBookingID: string) {
        return ElasticsearchClient.getInstance().get(this.TYPE, productBookingID)
            .then((resultGetProductBookingDetails: any) => {
                Log.debug('resultGetProductBookingDetails', resultGetProductBookingDetails);
                return new ProductBooking(resultGetProductBookingDetails, resultGetProductBookingDetails['productBookingID']);
            })
            .catch((err) => {
                Log.error('Error while getting product booking details: ', err);
                throw err;
            });
    }

    public static getProductBookingStock(productID: string, color?: string, size?: string) {
        let searchColor = {};
        let searchSize = {};

        if (color && color.length > 0) {
            searchColor = { "match": { "variationDetails.color.keyword": color } };
        }

        if (size && size.length > 0) {
            searchSize = { "match": { "variationDetails.size.keyword": size } };
        }

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "productID.keyword": productID } },
                        { "match": { "isDeleted": false } },
                        searchColor,
                        searchSize,
                        { "range": { "endTimestamp": { "gte": Date.now() } } }
                    ]
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultProductBookingStock: any) => {
                var bookingStock: number = 0;
                if (resultProductBookingStock && resultProductBookingStock.length > 0) {
                    resultProductBookingStock.forEach((productBookingStock: { "_source": IProductBooking }) => {
                        bookingStock += productBookingStock["_source"].quantity;
                    });
                }

                Log.debug(`Product ID: ${productID} has booking stock is: ${bookingStock}`);
                return { stock: bookingStock };
            });
    }

    public static getProductBookingByCartID(cartID: string) {
        Log.debug('Getting product booking by cartID: ' + cartID);

        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "cartID.keyword": cartID } },
                        { "match": { "isDeleted": false } }
                    ]
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultGetProductBookingByCartID: any) => {
                Log.debug('resultGetProductBookingByCartID', resultGetProductBookingByCartID);
                if (resultGetProductBookingByCartID && resultGetProductBookingByCartID.length > 0) {
                    return resultGetProductBookingByCartID.map((result: { [key: string]: any }) => {
                        return new ProductBooking(result._source, result._id)
                    });
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while getting product booking by cartID: ', error);
                throw error;
            });
    }

    public static getProductBookingInCart(cartID: string, productID: string, color?: string, size?: string) {
        let searchColor = {};
        let searchSize = {};


        if (color && color.length > 0) {
            searchColor = { "match": { "variationDetails.color.keyword": color } };
        }

        if (size && size.length > 0) {
            searchSize = { "match": { "variationDetails.size.keyword": size } };
        }

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "cartID.keyword": cartID } },
                        { "match": { "productID.keyword": productID } },
                        { "match": { "isDeleted": false } },
                        searchColor,
                        searchSize
                    ]
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultProductBookingStock: any) => {
                var bookingStock: number = 0;
                if (resultProductBookingStock && resultProductBookingStock.length > 0) {
                    resultProductBookingStock.forEach((productBookingStock: any) => {
                        bookingStock += productBookingStock['_source'].quantity;
                    });
                }

                Log.debug(`Product ID: ${productID} in Cart ID: ${cartID} has booking stock is: ${bookingStock}`);
                return { stock: bookingStock };
            });
    }
















    public static checkProductBookingByProductId(cartID: string, productID: string, color?: string, size?: string) {
        let searchColor = {};
        let searchSize = {};


        if (color && color.length > 0) {
            searchColor = { "match": { "variationDetails.color.keyword": color } };
        }

        if (size && size.length > 0) {
            searchSize = { "match": { "variationDetails.size.keyword": size } };
        }

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "cartID.keyword": cartID } },
                        { "match": { "productID.keyword": productID } },
                        { "match": { "isDeleted": false } },
                        searchColor,
                        searchSize,
                        { "range": { "startTimestamp": { "lte": Date.now() } } },
                        { "range": { "endTimestamp": { "gte": Date.now() } } }
                    ]
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultProductBookingStock: any) => {
                var bookingStock: number = 0;
                if (resultProductBookingStock && resultProductBookingStock.length > 0) {
                    resultProductBookingStock.forEach((productBookingStock: any) => {
                        bookingStock += productBookingStock['_source'].quantity;
                    });
                }

                Log.debug(`Product ID: ${productID} in Cart ID: ${cartID} has booking stock is: ${bookingStock}`);
                return { stock: bookingStock };
            })
            .catch((err) => {
                Log.error('Error while checking inventory of productID: ', productID, ' in cartID: ', cartID ,' with: ', err);
                return err;
            });

        
    }
}