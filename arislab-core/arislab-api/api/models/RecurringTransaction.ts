import {ElasticsearchClient, ElasticsearchQueryResultDocument} from "../components/ElasticsearchClient";
import {AbstractPersistentModel} from "./AbstractPersistentModel";
import {IStorePackage} from "./StorePackage";
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

export interface IRecurringResult {
    amount: string,
    referenceNo: string,
    gbpReferenceNo: string,
    currencyCode: string,
    resultCode: string,
    date: string,
    time: string,
    cardNo: string,
    amountPerMonth: string,
    totalAmount: string,
    thbAmount: string,
    recurringNo: string
}

export interface IRecurringTransaction {
    recurringTransactionID: string,
    storePackageInfo: IStorePackage,
    recurringResult: IRecurringResult,
    status: "PENDING" | "SUCCESS" | "FALSE",
    createdAt: number
}

export class RecurringTransaction extends AbstractPersistentModel {
    public recurringTransactionID: string;
    public storePackageInfo: IStorePackage;
    public recurringResult: IRecurringResult;
    public status: "PENDING" | "SUCCESS" | "FALSE";
    public createdAt: number;

    constructor(json: IRecurringTransaction, recurringTransactionID?: string) {
        super(recurringTransactionID);
        this.recurringTransactionID = recurringTransactionID;
        if( json ) {
            this.storePackageInfo = json.storePackageInfo;
            this.recurringResult = json.recurringResult;
            this.status = json.status;
            this.createdAt = json.createdAt;
        }
    }

    doUpdate(json: IRecurringTransaction): boolean {
        return true;
    }

    private static readonly TYPE = "recurring_transaction";
    protected getType(): string {
        return RecurringTransaction.TYPE;
    }

    public toJSON(): IRecurringTransaction {
        return {
            recurringTransactionID: this.recurringTransactionID,
            storePackageInfo: this.storePackageInfo,
            recurringResult: this.recurringResult,
            status: this.status,
            createdAt: this.createdAt
        }
    }

    public updateJSON(json: IRecurringTransaction) {
        return new Promise((resolve, reject) => {
            if( json ) {
                this.recurringTransactionID = json.recurringTransactionID;
                this.storePackageInfo = json.storePackageInfo;
                this.recurringResult = json.recurringResult;
                this.status = json.status;
                this.createdAt = json.createdAt;

                resolve( this.update(json) );
            } else {
                resolve( false );
            }
        });
        
    }

    // public static findCurrentRecurring(storeID: string, creditCardID: string): Promise<IRecurring[]> {
    //     Log.debug('Finding current recurring from storeID: ' + storeID + ' and creditCardID: ' + creditCardID);

    //     let searchQuery = {
    //         "query": {
    //             "bool": {
    //                 "must": [
    //                     {
    //                         "match": {
    //                             "storeID.keyword": storeID
    //                         }
    //                     },
    //                     {
    //                         "match": {
    //                             "creditCardID.keyword": creditCardID
    //                         }
    //                     },
    //                     {
    //                         "match": {
    //                             "isDeleted": "false"
    //                         }
    //                     }
    //                 ]
    //             }
    //         },
    //         "sort": [
    //             { "createdAt": "desc" }
    //         ]
    //     };

    //     return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
    //         if (json && json.length > 0) {
    //             Log.debug('Result current recurring from storeID: ' + storeID + ' and creditCardID: ' + creditCardID + ' is: ', json);
    //             return json.map((result: ElasticsearchQueryResultDocument) => {
    //                 return new Recurring(result._source, result._id);
    //             });
    //         } else {
    //             return [];
    //         }
    //     });
    // }

    // public static findRecurringList(storeID: string): Promise<IRecurring[]> {
    //     Log.debug('Finding list of recurring from storeID: ' + storeID);

    //     let searchQuery = {
    //         "query": {
    //             "bool": {
    //                 "must": [
    //                     {
    //                         "match": {
    //                             "storeID.keyword": storeID
    //                         }
    //                     }
    //                 ]
    //             }
    //         },
    //         "sort": [
    //             { "createdAt": "desc" }
    //         ]
    //     };

    //     return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
    //         if (json && json.length > 0) {
    //             Log.debug('Result list of recurring from storeID: ' + storeID + ' is: ', json);
    //             return json.map((result: ElasticsearchQueryResultDocument) => {
    //                 return new Recurring(result._source, result._id);
    //             });
    //         } else {
    //             return [];
    //         }
    //     });
    // }

    // public static findRecurringByRecurringNo(recurringNo: string): Promise<IRecurring[]> {
    //     Log.debug('Finding recurring from recurringNo: ' + recurringNo);

    //     let searchQuery = {
    //         "query": {
    //             "bool": {
    //                 "must": [
    //                     {
    //                         "match": {
    //                             "recurringInfo.recurringNo.keyword": recurringNo
    //                         }
    //                     }
    //                 ]
    //             }
    //         },
    //         "sort": [
    //             { "createdAt": "desc" }
    //         ]
    //     };

    //     return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
    //         if (json && json.length > 0) {
    //             Log.debug('Result find recurring from recurringNo: ' + recurringNo + ' is: ', json);
    //             return json.map((result: ElasticsearchQueryResultDocument) => {
    //                 return new Recurring(result._source, result._id);
    //             });
    //         } else {
    //             return [];
    //         }
    //     });
    // }


}
