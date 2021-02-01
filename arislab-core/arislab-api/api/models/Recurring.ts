import {ElasticsearchClient, ElasticsearchQueryResultDocument} from "../components/ElasticsearchClient";
import {AbstractPersistentModel} from "./AbstractPersistentModel";
import { Log } from '../ts-utils/Log';


export interface IVerifyInfo {
    resultCode: string
}

export interface IRecurringInfo {
    recurringNo: string,
    recurringAmount: number,
    recurringInterval: "M" | "Q" | "Y",
    recurringPeriod: string,
    allowAccumulate: "Y" | "N",
    cardToken: string,
}

export interface IRecurring {
    recurringID: string,
    storeID?: string,
    storePackageID?: string,
    creditCardID?: string,
    referenceNo?: string,
    recurringInfo?: IRecurringInfo,
    verifyInfo?: IVerifyInfo,
    createdAt?: number,
    deletedAt?: number,
    isDeleted?: boolean
}

export class Recurring extends AbstractPersistentModel {
    public recurringID: string;
    public storeID: string;
    public storePackageID: string;
    public creditCardID: string;
    public referenceNo: string;
    public recurringInfo: IRecurringInfo;
    public verifyInfo: IVerifyInfo;
    public createdAt: number;
    public deletedAt: number;
    public isDeleted: boolean;

    constructor(json: IRecurring, recurringID?: string) {
        super(recurringID);
        this.recurringID = recurringID;
        if( json ) {
            this.storeID = json.storeID;
            this.storePackageID = json.storePackageID;
            this.creditCardID = json.creditCardID;
            this.referenceNo = json.referenceNo;
            this.recurringInfo = json.recurringInfo;
            this.verifyInfo = json.verifyInfo;
            this.createdAt = json.createdAt;
            this.deletedAt = json.deletedAt;
            this.isDeleted = json.isDeleted;
        }
    }

    doUpdate(json: IRecurring): boolean {
        return true;
    }

    private static readonly TYPE = "recurring";
    protected getType(): string {
        return Recurring.TYPE;
    }

    public toJSON(): IRecurring {
        return {
            recurringID: this.recurringID,
            storeID: this.storeID,
            storePackageID: this.storePackageID,
            creditCardID: this.creditCardID,
            referenceNo: this.referenceNo,
            recurringInfo: this.recurringInfo,
            verifyInfo: this.verifyInfo,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt,
            isDeleted: this.isDeleted
        }
    }

    public updateJSON(json: IRecurring) {
        return new Promise((resolve, reject) => {
            if( json ) {
                this.recurringID = json.recurringID;
                this.storeID = json.storeID;
                this.storePackageID = json.storePackageID;
                this.creditCardID = json.creditCardID;
                this.referenceNo = json.referenceNo;
                this.recurringInfo = json.recurringInfo;
                this.verifyInfo = json.verifyInfo;
                this.createdAt = json.createdAt;
                this.deletedAt = json.deletedAt;
                this.isDeleted = json.isDeleted;

                resolve( this.update(json) );
            } else {
                resolve( false );
            }
        });
        
    }

    public static findCurrentRecurring(storeID: string, creditCardID: string): Promise<IRecurring[]> {
        Log.debug('Finding current recurring from storeID: ' + storeID + ' and creditCardID: ' + creditCardID);

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
                                "creditCardID.keyword": creditCardID
                            }
                        },
                        {
                            "match": {
                                "isDeleted": "false"
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
                Log.debug('Result current recurring from storeID: ' + storeID + ' and creditCardID: ' + creditCardID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new Recurring(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findRecurringList(storeID: string): Promise<IRecurring[]> {
        Log.debug('Finding list of recurring from storeID: ' + storeID);

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
                Log.debug('Result list of recurring from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new Recurring(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findRecurringByRecurringNo(recurringNo: string): Promise<IRecurring[]> {
        Log.debug('Finding recurring from recurringNo: ' + recurringNo);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "recurringInfo.recurringNo.keyword": recurringNo
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
                Log.debug('Result find recurring from recurringNo: ' + recurringNo + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new Recurring(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }


}
