"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPersistentModel_1 = require("./AbstractPersistentModel");
const ElasticsearchClient_1 = require("../components/ElasticsearchClient");
const Log_1 = require("../utils/Log");
const json2csv_1 = require("json2csv");
class Order extends AbstractPersistentModel_1.AbstractPersistentModel {
    constructor(json, _ID) {
        super(_ID);
        this.storeID = json.storeID;
        this.userID = json.userID;
        this.userInfo = json.userInfo;
        this.orderID = json.orderID;
        this.orderDate = json.orderDate;
        this.orderAdditionalDetails = json.orderAdditionalDetails;
        this.selectedProduct = json.selectedProduct;
        this.paymentInfo = json.paymentInfo;
        this.deliveryInfo = json.deliveryInfo;
    }
    doUpdate(json) {
        return true;
    }
    getType() {
        return Order.TYPE;
    }
    toJSON() {
        return {
            storeID: this.storeID,
            userID: this.userID,
            userInfo: this.userInfo,
            orderID: this.orderID,
            orderDate: this.orderDate,
            orderAdditionalDetails: this.orderAdditionalDetails,
            selectedProduct: this.selectedProduct,
            paymentInfo: this.paymentInfo,
            deliveryInfo: this.deliveryInfo,
        };
    }
    static findAllOrder(storeID, orderStatus, startDate, endDate) {
        Log_1.Log.debug(`Finding all order by store id: ${storeID}, status: ${orderStatus}, start date: ${startDate}, end date: ${endDate}`);
        let matchStore = {};
        let matchStatus = {};
        let notMatchStatus = {};
        let range = {};
        if (storeID && storeID.length > 0) {
            matchStore = {
                "match": {
                    "storeID.keyword": storeID
                }
            };
        }
        /*
        if (orderStatus && orderStatus.length > 0) {
            matchStatus = {
                "match": {
                    "paymentInfo.status.keyword": orderStatus
                }
            };
        }
        */
        if (orderStatus && orderStatus.length > 0) {
            if (orderStatus === "SUCCESS") {
                notMatchStatus = [
                    {
                        "match": {
                            "paymentInfo.status.keyword": "PENDING"
                        }
                    },
                    {
                        "match": {
                            "paymentInfo.status.keyword": "FAIL"
                        }
                    }
                ];
            }
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
                        // matchStatus,
                        range
                    ],
                    "must_not": notMatchStatus
                }
            },
            "sort": [
                { "orderDate": "desc" }
            ]
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json) => {
            if (json && json.length > 0) {
                return json.map((result) => {
                    Log_1.Log.debug('resultFindAllOrder: ', result);
                    return new Order(result._source, result._id);
                });
            }
            else {
                return [];
            }
        })
            .catch((error) => {
            Log_1.Log.error('Error while finding all order: ', error);
            throw error;
        });
    }
    static convertJsonToCsv(orderList) {
        try {
            Log_1.Log.debug(`==================== Convert JSON to CSV ====================`);
            let fields = [
                'storeID',
                'orderDate',
                'orderID',
                'paymentMethod',
                'status',
                'price'
            ];
            var csvData = orderList.map((order) => {
                let storeID;
                let orderDate;
                let orderID;
                let paymentMethod = 'N/A';
                let status;
                let price = 0;
                let availableQuantity = 1;
                if (order['storeID']) {
                    storeID = order['storeID'];
                }
                if (order['orderDate']) {
                    orderDate = this.timeConverter(order['orderDate']);
                }
                if (order['orderID']) {
                    orderID = order['orderID'];
                }
                if (order['paymentInfo']['method']) {
                    paymentMethod = order['paymentInfo']['method'];
                }
                if (order['paymentInfo']['status']) {
                    status = order['paymentInfo']['status'];
                }
                if (order['selectedProduct'] && order['selectedProduct'].length > 0) {
                    order['selectedProduct'].forEach(product => {
                        var productQuantity = 1;
                        if (product.hasOwnProperty('availableQuantity')) {
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
                };
                return convertedData;
            });
            let json2csvParser = new json2csv_1.Parser({ fields });
            let csv = json2csvParser.parse(csvData);
            Log_1.Log.debug(`CSV Data: `, csv);
            return csv;
        }
        catch (error) {
            Log_1.Log.error('Error while converting to csv with: ', error);
            throw error;
        }
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
Order.TYPE = "order";
exports.Order = Order;
//# sourceMappingURL=Order.js.map