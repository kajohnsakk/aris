import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../utils/Log';
import { Parser } from 'json2csv';


export interface IVerifyInfo {
	isVerified: Boolean,
    verifiedAt: Number,
    otpID: string,
    pinCode: string
}

export interface IConfig {
    useCart: Boolean,
    useCashOnDelivery: Boolean
}

export interface IPrice {
	firstPiece: string,
    additionalPiece: string
}

export interface IDelivery {
	price: IPrice
}


export interface IPaymentVerifyInfo {
	verifyID: string,
    isVerified: Boolean
}

export interface IGbPayInfo {
	token: string
}

export interface IBank {
	bankCode: string,
    label: string,
    value: string
}

export interface IPaymentInfo {
    bank: IBank,
    accountName: string,
	accountNumber: string,
	gbPayInfo: IGbPayInfo,
	qrImage: string,
	verifyInfo: IPaymentVerifyInfo
}

export interface IPolicies {
    privacyPolicy: string,
    returnRefundPolicy: string,
    shippingPolicy: string,
    cancellationPolicy: string
}
export interface IBusinessAddress {
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
}

export interface IAccountDetails {
    name: string,
    businessName: string
}

export interface IBusinessProfile {
    logo: string,
	accountDetails: IAccountDetails,
	businessEmail: string,
	businessPhoneNo: string,
	businessAddress: IBusinessAddress
}

export interface IStoreInfo {
    businessProfile: IBusinessProfile,
    policies: IPolicies,
	paymentInfo: IPaymentInfo,
	delivery: IDelivery,
	config: IConfig
}

export interface IStore {
    auth0_uid: string,
    email: string,
	storeID: string,
    storeInfo: IStoreInfo,
	createdAt: number,
	filterDate: number,
	registeredTimestamp: number,
	verifyInfo: IVerifyInfo
}

export class Store extends AbstractPersistentModel {
    public auth0_uid: string;
    public email: string;
	public storeID: string;
    public storeInfo: IStoreInfo;
    public createdAt: number;
	public filterDate: number;
    public registeredTimestamp: number;
    public verifyInfo: IVerifyInfo;

    constructor(json: IStore) {
        super(json.storeID);
        this.auth0_uid = json.auth0_uid;
        this.email = json.email;
        this.storeID = json.storeID;
        this.storeInfo = json.storeInfo;
        this.createdAt = json.createdAt;
		this.filterDate = json.filterDate;
        this.registeredTimestamp = json.registeredTimestamp;
        this.verifyInfo = json.verifyInfo;
    }

    doUpdate(json: IStore): boolean {
        return true;
    }

    private static readonly TYPE = "store";
    protected getType(): string {
        return Store.TYPE;
    }

    public toJSON(): any {
        return {
            auth0_uid: this.auth0_uid,
            email: this.email,
            storeID: this.storeID,
            storeInfo: this.storeInfo,
            createdAt: this.createdAt,
			filterDate: this.filterDate,
            registeredTimestamp: this.registeredTimestamp,
            verifyInfo: this.verifyInfo
        };
    }

    public static getStoreList(startDate: number, endDate: number) {
        Log.debug(`Finding store list with created date: ${startDate} - ${endDate}`);

        let range = {};

        if( startDate > 0 && endDate > 0 ) {
            range = {
                "range" : {
                    "createdAt" : {
                        "gte" : startDate,
                        "lte" : endDate,
                    }
                }
            }
        }

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        range
                    ]
                }
            },
            "sort": [
                { "createdAt": { "order": "desc"} }
            ]
        };
		
		Log.debug('Get store list with query: ', searchQuery);
		
        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
				// Log.debug('Result of get store list: ', json);
                if (json && json.length > 0) {
                    return json.map((result: any) => {
                        // Log.debug('resultGetStoreList: ', result);
                        return new Store(result._source);
                    });
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding all store list: ', error);
                throw error;
            });
    }
	
	public static getStoreByID(storeID: string) {
        Log.debug(`Finding store info by id: ${storeID}`);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
							"match": {
								"storeID.keyword": storeID
							}
						}
                    ]
                }
            },
            "sort": [
                { "createdAt": { "order": "desc"} }
            ]
        };
		
		Log.debug('Get store info with query: ', searchQuery);
		
        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
				Log.debug('Result of get store info: ', json);
                if (json && json.length > 0) {
                    return json.map((result: any) => {
                        Log.debug('resultGetStoreInfo: ', result);
                        return new Store(result._source);
                    });
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding store info: ', error);
                throw error;
            });
    }

	/*
    public static convertJsonToCsv(orderList: IOrder[]) {
        try {
            Log.debug(`==================== Convert JSON to CSV ====================`);

            let fields = [
                'storeID',
                'orderDate',
                'orderID',
                'paymentMethod',
                'status',
                'price'
            ];

            var csvData = orderList.map( (order: IOrder) => {
                let storeID: string;
                let orderDate: string;
                let orderID: string;
                let paymentMethod: string = 'N/A';
                let status: string;
                let price: number = 0;
                let availableQuantity: number = 1;

                if( order['storeID'] ) {
                    storeID = order['storeID'];
                }
                if( order['orderDate'] ) {
                    orderDate = this.timeConverter(order['orderDate']);
                }
                if( order['orderID'] ) {
                    orderID = order['orderID'];
                }
                if( order['paymentInfo']['method'] ) {
                    paymentMethod = order['paymentInfo']['method'];
                }
                if( order['paymentInfo']['status'] ) {
                    status = order['paymentInfo']['status'];
                }
                if( order['selectedProduct'] && order['selectedProduct'].length > 0 ) {
                    order['selectedProduct'].forEach( product => {
                        var productQuantity = 1;
                        if( product.hasOwnProperty('availableQuantity') ) {
                            productQuantity = product['availableQuantity'];
                        }
                        availableQuantity = Math.max(availableQuantity, productQuantity);
                        price += (product['productValue']['price'] * availableQuantity);
                    });
                }
                
                let convertedData = {
                    storeID,
                    orderDate,
                    orderID,
                    paymentMethod,
                    status,
                    price
                }

                return convertedData;
            });

            let json2csvParser = new Parser({ fields });
            let csv = json2csvParser.parse(csvData);
            Log.debug(`CSV Data: `, csv);
            return csv;
        } catch (error) {
            Log.error('Error while converting to csv with: ', error);
            throw error;
        }
        
    }

    public static timeConverter(UNIX_timestamp: number):string {
        var a = new Date(UNIX_timestamp * 1000);
        var year = a.getFullYear();
        var month = this.str_pad(a.getMonth() + 1);
        var date = this.str_pad(a.getDate());
        var hour = this.str_pad(a.getHours());
        var min = this.str_pad(a.getMinutes());
        var sec = this.str_pad(a.getSeconds());
        var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
        
        return time;
    }

    public static str_pad(num: number): string {
        return String("00" + num).slice(-2);
    }
	*/

}