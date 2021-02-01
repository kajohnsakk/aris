"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Store = void 0;
var AbstractPersistentModel_1 = require("./AbstractPersistentModel");
var ElasticsearchClient_1 = require("../components/ElasticsearchClient");
var js_sha256_1 = require("js-sha256");
var Log_1 = require("../ts-utils/Log");
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(json) {
        var _this = _super.call(this, json.storeID) || this;
        _this.auth0_uid = json.auth0_uid;
        _this.email = json.email;
        _this.storeID = json.storeID;
        _this.createdAt = Date.now();
        _this.registeredTimestamp = json.registeredTimestamp || 0;
        _this.verifyInfo = {
            isVerified: false,
            verifiedAt: 0,
            otpID: ""
        };
        _this.storeInfo = json.storeInfo;
        return _this;
    }
    Store.prototype.doUpdate = function (json) {
        return true;
    };
    Store.prototype.getType = function () {
        return Store.TYPE;
    };
    Store.prototype.toJSON = function () {
        return {
            auth0_uid: this.auth0_uid,
            email: this.email,
            storeID: this.storeID,
            storeInfo: this.storeInfo,
            createdAt: this.createdAt,
            registeredTimestamp: this.registeredTimestamp,
            verifyInfo: this.verifyInfo
        };
    };
    Store.findStoreByAuth0UID = function (auth0_uid) {
        var searchQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: { "auth0_uid.keyword": auth0_uid }
                        },
                    ]
                }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            if (json && json.length > 0) {
                return { found: true };
            }
            else {
                return { found: false };
            }
        });
    };
    Store.findStoreByEmail = function (email) {
        var searchQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: { "email.keyword": email }
                        },
                    ]
                }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            if (json && json.length > 0) {
                return { found: true };
            }
            else {
                return { found: false };
            }
        });
    };
    Store.findStoreIDByEmail = function (email) {
        Log_1.Log.debug("findStoreByEmail searching with email ", email);
        var searchQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: { "email.keyword": email }
                        },
                    ]
                }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            Log_1.Log.debug("founded with json ", json);
            if (json && json.length > 0) {
                return json.map(function (resultJSON) {
                    return {
                        email: resultJSON._source.email,
                        storeID: resultJSON._source.storeID,
                        createdAt: resultJSON._source.createdAt,
                        registeredTimestamp: resultJSON._source.registeredTimestamp
                    };
                });
            }
            else {
                return [];
            }
        });
    };
    Store.findStoreIDByAuth0UID = function (auth0_uid) {
        Log_1.Log.debug("findStoreIDByAuth0UID searching with auth0_uid ", auth0_uid);
        var searchQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: { "auth0_uid.keyword": auth0_uid }
                        },
                    ]
                }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            Log_1.Log.debug("founded with json ", json);
            if (json && json.length > 0) {
                return json.map(function (resultJSON) {
                    return {
                        auth0_uid: resultJSON._source.auth0_uid,
                        email: resultJSON._source.email,
                        storeID: resultJSON._source.storeID,
                        config: {
                            enabledEditProductHashtag: !!resultJSON._source.storeInfo.config
                                .enabledEditProductHashtag
                        },
                        createdAt: resultJSON._source.createdAt,
                        registeredTimestamp: resultJSON._source.registeredTimestamp
                    };
                });
            }
            else {
                return [];
            }
        });
    };
    Store.findAllStore = function () {
        var searchQuery = {
            query: {
                match_all: {}
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            if (json && json.length > 0) {
                return json.map(function (resultJSON) {
                    return resultJSON;
                });
            }
            else {
                return [];
            }
        })["catch"](function (error) {
            Log_1.Log.error("Error while finding all store : ", error);
            throw error;
        });
    };
    Store.findStoreIDByPinCode = function (pinCode) {
        Log_1.Log.debug("findStoreByPinCode searching with pincode " +
            pinCode +
            " (" +
            js_sha256_1.sha256(pinCode) +
            ")");
        var searchQuery = {
            query: {
                bool: {
                    must: [
                        { term: { "verifyInfo.pinCode.keyword": js_sha256_1.sha256(pinCode) } },
                        { term: { "verifyInfo.isVerified": true } },
                    ]
                }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            Log_1.Log.debug("founded with json ", json);
            if (json && json.length > 0) {
                return json.map(function (resultJSON) {
                    return {
                        storeID: resultJSON._source.storeID
                    };
                });
            }
            else {
                return [];
            }
        });
    };
    Store.findStoreIDByPaymentInfo = function (bankCode, accountNumber) {
        Log_1.Log.debug("findStoreByPaymentInfo searching with bankCode: " + bankCode + ", and accountNumber: " + accountNumber);
        var searchQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: { "storeInfo.paymentInfo.bank.bankCode.keyword": bankCode }
                        },
                        {
                            term: {
                                "storeInfo.paymentInfo.accountNumber.keyword": accountNumber
                            }
                        },
                        { term: { "storeInfo.paymentInfo.verifyInfo.isVerified": true } },
                    ]
                }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            Log_1.Log.debug("founded with json ", json);
            if (json && json.length > 0) {
                return json.map(function (resultJSON) {
                    return {
                        storeID: resultJSON._source.storeID
                    };
                });
            }
            else {
                return [];
            }
        });
    };
    Store.findByCustomFields = function (fieldArray) {
        Log_1.Log.debug("Finding store by customfields with ", fieldArray);
        var searchQuery = {
            query: {
                bool: {
                    must: []
                }
            }
        };
        fieldArray.forEach(function (fieldObj) {
            var _a;
            var queryToPush = {
                match: (_a = {}, _a[fieldObj["fieldName"]] = fieldObj["fieldValue"], _a)
            };
            searchQuery["query"]["bool"]["must"].push(queryToPush);
        });
        return ElasticsearchClient_1.ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then(function (json) {
            if (json && json.length > 0) {
                return json.map(function (result) {
                    Log_1.Log.debug("Result findByCustomFields is ", result);
                    return new Store(result._source);
                });
            }
            else {
                return [];
            }
        });
    };
    Store.TYPE = "store";
    return Store;
}(AbstractPersistentModel_1.AbstractPersistentModel));
exports.Store = Store;
