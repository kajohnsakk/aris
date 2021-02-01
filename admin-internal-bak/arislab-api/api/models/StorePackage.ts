import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { ExternalProxy } from '../modules/ExternalProxy';
import { ElasticsearchClient } from '../components/ElasticsearchClient';
import {AbstractPersistentModel} from "./AbstractPersistentModel";

export interface IServiceFee {
    feeName: string,
    charge: number,
    chargeType: "PERCENT" | "FIXED"
}

export interface IFeeInfo {
    service: IServiceFee,
    qrCodeService: IServiceFee,
    creditCardService: IServiceFee
}

export interface IBillingInfo {
    billingType: "" | "WEEKLY" | "MONTHLY" | "YEARLY",
    billingDate: number
}

export interface IPackageInfo {
    name: string,
    code: string,
    description: string,
    isSubscribePackage: boolean,
    memberPrice: number,
    activeDays: number,
    note: string,
    billingInfo: IBillingInfo,
    feeInfo: IFeeInfo
}

export interface IStorePackage {
    storePackageID: string,
    storeID: string,
    packageInfo: IPackageInfo,
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "CHECKING_PAYMENT",
    createdAt: number,
    updatedAt: number,
    activeDate: number,
    expiryDate: number
}


export class StorePackage extends AbstractPersistentModel {
    public static TYPE = "store_package";
    private static EXTERNAL_API_HOST = process.env.EXTERNAL_API_HOST;
    private static EXTERNAL_API_PORT = process.env.EXTERNAL_API_PORT;
    private static EXTERNAL_API_URL = `${StorePackage.EXTERNAL_API_HOST}:${StorePackage.EXTERNAL_API_PORT}/api`;
	
	public storePackageID: string;
    public storeID: string;
    public packageInfo: IPackageInfo;
    public status: "ACTIVE" | "INACTIVE" | "PENDING" | "CHECKING_PAYMENT";
    public createdAt: number;
    public updatedAt: number;
    public activeDate: number;
    public expiryDate: number;

    constructor(json: IStorePackage, storePackageID?: string) {
        super(storePackageID);
        this.storePackageID = storePackageID;
        if( json ) {
            this.storeID = json.storeID;
            this.packageInfo = json.packageInfo;
            this.status = json.status;
            this.createdAt = json.createdAt;
            this.updatedAt = json.updatedAt;
            this.activeDate = json.activeDate;
            this.expiryDate = json.expiryDate;
        }
    }

    doUpdate(json: IStorePackage): boolean {
        return true;
    }
	
	protected getType(): string {
        return StorePackage.TYPE;
    }

    public toJSON(): IStorePackage {
        return {
            storePackageID: this.storePackageID,
            storeID: this.storeID,
            packageInfo: this.packageInfo,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            activeDate: this.activeDate,
            expiryDate: this.expiryDate,
        }
    }

    public updateJSON(json: IStorePackage) {
        return new Promise((resolve, reject) => {
            if( json ) {
                this.storePackageID = json.storePackageID;
                this.storeID = json.storeID;
                this.packageInfo = json.packageInfo;
                this.status = json.status;
                this.createdAt = json.createdAt;
                this.updatedAt = json.updatedAt;
                this.activeDate = json.activeDate;
                this.expiryDate = json.expiryDate;

                resolve( this.update(json) );
            } else {
                resolve( false );
            }
        });
        
    }

    public static getCurrentStorePackage() {
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [ 
						{ "match": { "status.keyword": "ACTIVE" } },
						{ "range": { "activeDate" : { "lte": Date.now() } } },
                        { "range": { "expiryDate" : { "gte": Date.now() } } }
					],
                    "must_not": [ { "term": { "storeID.keyword": "" } }]
                }
            }
        }
        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (!json)
                    Log.error('Current store package not available');
                else
                    return json.map((j: any) => {
                        return j['_source'];
                    });
            });
    }

	public static async getStorePackageByStoreID(storeID: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "storeID.keyword": storeID } }
                    ]
                }
            },
			"sort": [
				{
					"activeDate": {
						"order": "desc"
					}
				}
			]
        };

        Log.debug('[StorePackage] Getting store package list by storeID with query: ', searchQuery);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (!json)
                    Log.error('Error while getting store package list by storeID: '+storeID);
                else
                    return json.map((j: any) => {
                        return j['_source'];
                    });
            });
    }
	
	public static async getStorePackageInfoByStorePackageID(storePackageID: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "storePackageID.keyword": storePackageID } }
                    ]
                }
            },
			"sort": [
				{
					"activeDate": {
						"order": "desc"
					}
				}
			]
        };

        Log.debug('[StorePackage] Getting store package info by storePackageID with query: ', searchQuery);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (!json)
                    Log.error('Error while getting store package info by storePackageID: '+storePackageID);
                else
                    return json.map((j: any) => {
                        return j['_source'];
                    });
            });
    }
	
	public static async deleteStorePackageByStorePackageID(storePackageID: string) {
		return ElasticsearchClient.getInstance().delete(this.TYPE, storePackageID);
	}
/*
    public static async getStoreInfoByStoreID(storeID: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "storeID.keyword": storeID } }
                    ]
                }
            }
        };

        Log.debug('[StorePackage] Getting store info by storeID with query: ', searchQuery);

        const count = await ElasticsearchClient.getInstance().count(this.TYPE, searchQuery);

        if (count) {
            return ElasticsearchClient.getInstance().get(this.TYPE, storeID)
                .then((resultGetStoreInfoByID) => {
                    Log.debug("[StorePackage] Result getting store info by storeID: ", resultGetStoreInfoByID);
                    return resultGetStoreInfoByID;
                });
        } else {
            Log.error("[StorePackage] Can't find storeID: " + storeID);
            return { "error": "id not found" };
        }
    }

    public static listAllStore(from?: number) {
        // let searchOptions = { "size": 3000 };
        let searchOptions = {};
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [ { "exists": { "field": "storeID" } } ],
                    "must_not": [ { "term": { "storeID.keyword": "" } }]
                }
            },
            "sort": [
                { "createdAt": { "order": "asc" } }
            ]
        }

        if (from >= 0) {
            searchOptions['size'] = 20;
            searchOptions['from'] = from;
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery, searchOptions)
            .then((json: any) => {
                if (!json)
                    Log.error('Store not available');
                else
                    return json.map((j: any) => {
                        return j['_source'];
                    });
            }).then(async (sourceArray: any) => {
                return this.pushExtraInfoToStore(sourceArray);
            })
    }

    public static pushExtraInfoToStore(sourceArray: any) {
        return new Promise(async (resolve, reject) => {
            try {
                for (let index = 0; index < sourceArray.length; index++) {
                    const store = sourceArray[index];
                    let resultFindByStoreID: any = await Channel.findByStoreID(store['storeID']);

                    sourceArray[index]['channelInfo'] = {}
                    
                    if (resultFindByStoreID.length > 0) {
                        sourceArray[index]['channelInfo'] = resultFindByStoreID[0]['channels']['facebookSelectedPage'];
                    }

                    if (
                        store.storeInfo.hasOwnProperty('paymentInfo') &&
                        store.storeInfo.paymentInfo.hasOwnProperty('gbPayInfo') &&
                        store.storeInfo.paymentInfo.gbPayInfo.hasOwnProperty('token')
                    ) {
                        // let token = store['storeInfo']['paymentInfo']['gbPayInfo']['token'];

                        // let resultVerifyGBPayToken: any = await GBPay.verifyToken(token);                        
                        // if (resultVerifyGBPayToken.resultCode === "00") {
                        //     sourceArray[index]['verifyGBTokenInfo'] = "VALID";
                        // } else {
                        //     sourceArray[index]['verifyGBTokenInfo'] = "INVALID";
                        // }
                    }
                    ('0' + 11).slice(-2)
                    let createdAt = new Date(sourceArray[index]['createdAt']);
                    let dateCreated = `${('0' + createdAt.getHours()).slice(-2)}:${('0' + createdAt.getMinutes()).slice(-2)} ${('0' + createdAt.getDate()).slice(-2)}/${('0' + (createdAt.getMonth()+1)).slice(-2)}/${createdAt.getFullYear()}`;
                    sourceArray[index]['channelInfo']['dateCreated'] = dateCreated;

                    if (index === sourceArray.length - 1) {
                        resolve(sourceArray);
                    }
                }
            } catch (error) {
                reject(error);
            }
        }).then(() => {
            return sourceArray;
        });
    }

    public static retrieveTokenList(storeList?: Array<string>) {
        let storeListQuery = {};

        if (storeList && storeList.length > 0) {
            storeListQuery['must'] = [];
            storeListQuery['must'].push({
                "terms": {
                    "storeID.keyword": storeList
                }
            })
        }

        const searchQuery = {
            "bool": {
                ...storeListQuery,
                "must_not": [
                    { "terms": { "storeInfo.paymentInfo.gbPayInfo.token.keyword": [""] } }
                ]
            }
        };

        const aggregate = {
            "terms": {
                "field": "storeInfo.paymentInfo.gbPayInfo.token.keyword",
                "size": 1000
            }
        };

        Log.debug('Retrieving token list with query: ', searchQuery, ' and aggregate : ', aggregate)

        return ElasticsearchClient.getInstance().aggregate(this.TYPE, searchQuery, aggregate)
            .then((resultRetrieveTokenList: { [key: string]: any }) => {
                return resultRetrieveTokenList.filter((token: { key: string, doc_count: number }) => {
                    const tokenRegex = new RegExp(/[A-Za-z0-9+/]/)
                    return token.key.length > 25 && tokenRegex.test(token.key);
                });
            });
    }
*/
}