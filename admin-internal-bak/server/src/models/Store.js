"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPersistentModel_1 = require("./AbstractPersistentModel");
const ElasticsearchClient_1 = require("../components/ElasticsearchClient");
const Log_1 = require("../utils/Log");
class Store extends AbstractPersistentModel_1.AbstractPersistentModel {
    constructor(json) {
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
    doUpdate(json) {
        return true;
    }
    getType() {
        return Store.TYPE;
    }
    toJSON() {
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
    static getStoreList(startDate, endDate) {
        Log_1.Log.debug(`Finding store list with created date: ${startDate} - ${endDate}`);
        let range = {};
        if (startDate > 0 && endDate > 0) {
            range = {
                "range": {
                    "createdAt": {
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
                        range
                    ]
                }
            },
            "sort": [
                { "createdAt": { "order": "desc" } }
            ]
        };
        Log_1.Log.debug('Get store list with query: ', searchQuery);
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json) => {
            Log_1.Log.debug('Result of get store list: ', json);
            if (json && json.length > 0) {
                return json.map((result) => {
                    Log_1.Log.debug('resultGetStoreList: ', result);
                    return new Store(result._source);
                });
            }
            else {
                return [];
            }
        })
            .catch((error) => {
            Log_1.Log.error('Error while finding all store list: ', error);
            throw error;
        });
    }
}
Store.TYPE = "store";
exports.Store = Store;
//# sourceMappingURL=Store.js.map