import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../utils/Log';
import { Parser } from 'json2csv';
import { Utils } from './Utils';


export interface IWithdrawInfo {
    status: string,
    statusCode: string,
    referenceNo: string
}

export interface IOrderInfo {
    orderID: string,
    customerName: string
}

export interface IFundsTransaction {
    fundTransactionID: string,
    storeID: string,
    amount: number,
    actualAmount: number,
    fee: number,
	feeList: IFee[],
    type: string,
    orderInfo: IOrderInfo,
    withdrawInfo: IWithdrawInfo,
    createdAt: number,
    isDeleted: Boolean,
    deletedAt: number
}

export interface IFee {
	feeName: 'SERVICE' | 'QR_CODE' | 'CREDIT_CARD',
    serviceType: 'SERVICE_FEE' | 'PAYMENT_GATEWAY_FEE',
    charge: number,
    chargeType: 'PERCENT' | 'FIXED',
    amountCharge: number
}

export class FundsTransaction extends AbstractPersistentModel {
    public fundTransactionID: string;
    public storeID: string;
    public amount: number;
    public actualAmount: number;
    public fee: number;
	public feeList: IFee[];
    public type: string;
    public orderInfo: IOrderInfo;
    public withdrawInfo: IWithdrawInfo;
    public createdAt: number;
    public isDeleted: Boolean;
    public deletedAt: number;

    constructor(json: IFundsTransaction) {
        super(json.fundTransactionID);
        this.fundTransactionID = json.fundTransactionID;
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

    public static getFundsTransactionList(storeID: string, startDate: number, endDate: number) {
        Log.debug(`Finding funds transaction by store id: ${storeID}, start date: ${startDate}, end date: ${endDate}`);

        let matchStore = {};
        let matchStatus = {};
        let range = {};

        if (storeID && storeID.length > 0) {
            matchStore = {
                "match": {
                    "storeID.keyword": storeID
                }
            };
        }

        // if (type && type.length > 0) {
        //     matchStatus = {
        //         "match": {
        //             "type.keyword": type
        //         }
        //     };
        // }

        if (startDate > 0 && endDate > 0) {
            range = {
                "range": {
                    "createdAt": {
                        "gte": startDate,
                        "lte": endDate,
                    }
                }
            }
        }

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        matchStore,
                        matchStatus,
                        range,
                        {
                            "match": { "isDeleted": false }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    return json.map((result: any) => {
                        // Log.debug('result funds transaction list: ', result);
                        return new FundsTransaction(result._source);
                    });
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding fund transaction: ', error);
                throw error;
            });
    }

    public static convertJsonToCsv(fundTransactionList: IFundsTransaction[]) {
        try {
            Log.debug(`==================== Convert JSON to CSV ====================`);

            let fields = [
                'date',
                'type',
                'orderID',
                'customerName',
                'amount',
                'fee',
                'actualAmount'
            ];

            const csvData = fundTransactionList.map((fundsTransaction: IFundsTransaction) => {
                let date: string;
                let type: string;
                let orderID: string;
                let customerName: string;
                let amount: number = 0;
                let fee: number = 0;
                let actualAmount: number = 0;

                if (fundsTransaction['createdAt']) date = Utils.timeConverter(fundsTransaction['createdAt']);
                if (fundsTransaction['type']) type = fundsTransaction['type'];
                if (fundsTransaction['orderInfo']['orderID']) orderID = fundsTransaction['orderInfo']['orderID'];
                if (fundsTransaction['orderInfo']['customerName']) customerName = fundsTransaction['orderInfo']['customerName'];
                if (fundsTransaction['amount']) amount = fundsTransaction['amount'];
                if (fundsTransaction['fee']) fee = fundsTransaction['fee'];
                if (fundsTransaction['actualAmount']) actualAmount = fundsTransaction['actualAmount'];

                let convertedData = {
                    date,
                    type,
                    orderID,
                    customerName,
                    amount,
                    fee,
                    actualAmount
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
	
	public static getFundsTransactionByOrderID(orderID: string) {
				
		let searchQuery = {
            "query": {
                "bool": {
                    "must": [
						{
							"match": {
								"orderInfo.orderID.keyword": orderID
							}
						},
						{
							"match": {
								"isDeleted": false
							}
						}
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
					Log.debug('resultFindFundsTransactionByOrderID: ', json);
                    return json.map((result: any) => {
                        return new FundsTransaction(result._source);
                    });
                } else {
					Log.debug('Not found fundsTransaction from orderID: '+orderID);
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while get funds transaction by orderID: ', error);
                throw error;
            });
    }
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public static getDepositFundsTransactionList() {
        Log.debug(`Finding deposit funds transaction`);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
						{
							"match": {
								"type.keyword": "DEPOSIT"
							}
						},
                        {
                            "match": { "isDeleted": false }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    return json.map((result: any) => {
                        // Log.debug('result funds transaction list: ', result);
                        return new FundsTransaction(result._source);
                    });
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding fund transaction: ', error);
                throw error;
            });
    }

}