import { AbstractPersistentModel } from "./AbstractPersistentModel";
import { ElasticsearchClient } from "../components/ElasticsearchClient";

import { Log } from "../ts-utils/Log";

export interface IOrderInfo {
    orderID: string,
    customerName: string
}

export interface IWithdrawInfoJSON {
    status: string,
    statusCode: string,
    referenceNo: string,
    invoiceID: string,
    invoiceFileUrl: string,
    orderFileUrl: string
}

export interface IFeeList {
    feeName: 'SERVICE' | 'QR_CODE' | 'CREDIT_CARD',
    serviceType: 'SERVICE_FEE' | 'PAYMENT_GATEWAY_FEE',
    charge: number,
    chargeType: 'PERCENT' | 'FIXED',
    totalCharge: number
}

export interface IFundsTransaction {
    fundTransactionID: string,
    storeID: string,
    amount: number,
    actualAmount: number,
    fee: number,
    feeList: IFeeList[],
    type: string,
    orderInfo: IOrderInfo,
    withdrawInfo: IWithdrawInfoJSON,
    createdAt: Date,
    isDeleted: boolean,
    deletedAt: number
}

export class FundsTransaction extends AbstractPersistentModel {
    public fundTransactionID: string;
    public storeID: string;
    public amount: number;
    public actualAmount: number;
    public fee: number;
    public feeList: IFeeList[];
    public type: string;
    public orderInfo: IOrderInfo;
    public withdrawInfo: IWithdrawInfoJSON;
    public createdAt: Date;
    public isDeleted: boolean;
    public deletedAt: number;

    constructor(json: IFundsTransaction, fundTransactionID?: string) {
        super(fundTransactionID);
        this.fundTransactionID = fundTransactionID;
        this.storeID = json.storeID;
        this.amount = json.amount;
        this.actualAmount = json.actualAmount;
        this.fee = json.fee;
        this.feeList = json.feeList;
        this.type = json.type;
        this.orderInfo = json.orderInfo;
        this.withdrawInfo = json.withdrawInfo;
        this.createdAt = json.createdAt;
        this.isDeleted = json.isDeleted;
        this.deletedAt = json.deletedAt;
    }

    doUpdate(json: IFundsTransaction): boolean {
        return true;
    }

    private static readonly TYPE = "funds_transaction";
    protected getType(): string {
        return FundsTransaction.TYPE;
    }

    public toJSON(): any {
        return {
            fundTransactionID: this.fundTransactionID,
            storeID: this.storeID,
            amount: this.amount,
            actualAmount: this.actualAmount,
            fee: this.fee,
            feeList: this.feeList,
            type: this.type,
            orderInfo: this.orderInfo,
            withdrawInfo: this.withdrawInfo,
            createdAt: this.createdAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt
        };
    }

    public static findById(storeID: string, type?: string, startDate?: Number, endDate?:Number): Promise<FundsTransaction> {
        
        let matchType = {};
        let filter = {};

        if( type && type.length > 0 ) {
            matchType = {
                match: {
                    "type.keyword": type
                }
            };
        }

        if( startDate > 0 && endDate > 0 ) {
            filter = {
                range: { 'createdAt': { gte: startDate, lte: endDate } } 
            };
        }
        
        let searchQuery = {
            query: {
                bool: {
                    must: [
                        { match: { "storeID.keyword": storeID } }, 
                        { match: { isDeleted: false } },
                        matchType
                    ],
                    filter
                }
            },
            sort: [
                {
                    "createdAt": {
                        "order": "desc"
                    }
                }
            ]
        };

        Log.debug('[FundsTransaction] Finding funds transaction by id with query: ', searchQuery);

        return ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    Log.debug("[FundsTransaction] Result find funds transaction by id: ", json);
                    return json.map((result: any) => {
                        return new FundsTransaction(result._source);
                    });
                } else {
                    return [];
                }
            });
    }

    public static findByOrderId(orderID: string): Promise<FundsTransaction> {
        let searchQuery = {
            query: {
                match: {
                    'orderInfo.orderID.keyword': orderID
                }
            }
        };

        Log.debug('[FundsTransaction] Finding funds transaction by OrderID with query: ', searchQuery);

        return ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    Log.debug("[FundsTransaction] Result find funds transaction by orderID: ", json);
                    return json.map((result: any) => {
                        return new FundsTransaction(result._source);
                    });
                } else {
                    return [];
                }
            });
    }

    public static findByStoreID(storeID: string): Promise<Array<FundsTransaction>> {
        let searchQuery = {
            "query": {
                "match": {
                    "storeID.keyword": storeID
                }
            }
        }

        Log.debug('[FundsTransaction] Finding funds transaction by storeID with query: ', searchQuery);

        return ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    Log.debug("[FundsTransaction] Result find funds transaction by storeID: ", json);
                    return json.map((result: any) => {
                        return new FundsTransaction(result._source);
                    });
                } else {
                    return [];
                }
            });
    }
}
