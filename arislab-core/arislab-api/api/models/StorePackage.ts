import {ElasticsearchClient, ElasticsearchQueryResultDocument} from "../components/ElasticsearchClient";
import {AbstractPersistentModel} from "./AbstractPersistentModel";
import { Log } from '../ts-utils/Log';

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

    private static readonly TYPE = "store_package";
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

    public static findCurrentStorePackage(storeID: string): Promise<IStorePackage[]> {
        Log.debug('Finding current store package from storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        },
                        {
                            "match": {
                                "status.keyword": "ACTIVE"
                            }
                        },
                        {
                            "range": {
                                "activeDate" : {
                                    "lte": Date.now()
                                }
                            }
                        },
                        {
                            "range": {
                                "expiryDate" : {
                                    "gte": Date.now()
                                }
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result current store package from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new StorePackage(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findStorePackageByID(storePackageID: string): Promise<IStorePackage[]> {
        Log.debug('Finding store package from storePackageID: ' + storePackageID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storePackageID.keyword": storePackageID
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result store package from storePackageID: ' + storePackageID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new StorePackage(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findStorePackageList(storeID: string): Promise<IStorePackage[]> {
        Log.debug('Finding list of store package from storeID: ' + storeID);

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
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result list of store package from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new StorePackage(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findLastStorePackage(storeID: string): Promise<IStorePackage[]> {
        Log.debug('Finding last store package from storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        },
                        {
                            "range": {
                                "expiryDate" : {
                                    "lte": Date.now()
                                }
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result last store package from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new StorePackage(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findNextStorePackage(storeID: string): Promise<IStorePackage[]> {
        Log.debug('Finding next store package from storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        },
                        {
                            "range": {
                                "activeDate" : {
                                    "gte": Date.now()
                                }
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result next store package from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new StorePackage(result._source, result._id);
                });
            } else {
                Log.debug('Not found next store package from storeID: ' + storeID);
                return [];
            }
        });
    }

}
