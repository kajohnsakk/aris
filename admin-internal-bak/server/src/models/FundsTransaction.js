"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPersistentModel_1 = require("./AbstractPersistentModel");
const ElasticsearchClient_1 = require("../components/ElasticsearchClient");
const Log_1 = require("../utils/Log");
class FundsTransaction extends AbstractPersistentModel_1.AbstractPersistentModel {
    constructor(json) {
        super(json.fundTransactionID);
        this.fundTransactionID = json.fundTransactionID;
        this.storeID = json.storeID;
        this.amount = json.amount;
        this.actualAmount = json.actualAmount;
        this.fee = json.fee;
        this.type = json.type;
        this.orderInfo = json.orderInfo;
        this.withdrawInfo = json.withdrawInfo;
        this.createdAt = json.createdAt;
        this.isDeleted = json.isDeleted;
        this.deletedAt = json.deletedAt;
    }
    doUpdate(json) {
        return true;
    }
    getType() {
        return FundsTransaction.TYPE;
    }
    toJSON() {
        return {
            fundTransactionID: this.fundTransactionID,
            storeID: this.storeID,
            amount: this.amount,
            actualAmount: this.actualAmount,
            fee: this.fee,
            type: this.type,
            orderInfo: this.orderInfo,
            withdrawInfo: this.withdrawInfo,
            createdAt: this.createdAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt
        };
    }
    static getFundsTransactionList(storeID, type, startDate, endDate) {
        Log_1.Log.debug(`Finding funds transaction by store id: ${storeID}, type: ${type}, start date: ${startDate}, end date: ${endDate}`);
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
        if (type && type.length > 0) {
            matchStatus = {
                "match": {
                    "type.keyword": type
                }
            };
        }
        if (startDate > 0 && endDate > 0) {
            range = {
                "range": {
                    "orderDate": {
                        "gte": startDate,
                        "lte": endDate,
                    }
                }
            };
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
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json) => {
            if (json && json.length > 0) {
                return json.map((result) => {
                    Log_1.Log.debug('result funds transaction list: ', result);
                    return new FundsTransaction(result._source);
                });
            }
            else {
                return [];
            }
        })
            .catch((error) => {
            Log_1.Log.error('Error while finding fund transaction: ', error);
            throw error;
        });
    }
    static convertJsonToCsv(fundTransactionList) {
        /*
        
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

            var csvData = orderList.map( (order: IFundsTransaction) => {
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
        */
    }
    static timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var year = a.getFullYear();
        var month = this.str_pad(a.getMonth() + 1);
        var date = this.str_pad(a.getDate());
        var hour = this.str_pad(a.getHours());
        var min = this.str_pad(a.getMinutes());
        var sec = this.str_pad(a.getSeconds());
        var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
    static str_pad(num) {
        return String("00" + num).slice(-2);
    }
}
FundsTransaction.TYPE = "funds_transaction";
exports.FundsTransaction = FundsTransaction;
//# sourceMappingURL=FundsTransaction.js.map