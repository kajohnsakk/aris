"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPersistentModel_1 = require("./AbstractPersistentModel");
const ElasticsearchClient_1 = require("../components/ElasticsearchClient");
const Log_1 = require("../utils/Log");
const ExternalProxy_1 = require("../modules/ExternalProxy");
class GBPayAccount extends AbstractPersistentModel_1.AbstractPersistentModel {
    constructor(json, id) {
        super(id);
        this.id = json.id;
        this.gbPayAccountID = json.gbPayAccountID || "";
        this.gbPayAccountInfo = json.gbPayAccountInfo;
    }
    doUpdate(json) {
        return true;
    }
    getType() {
        return GBPayAccount.TYPE;
    }
    toJSON() {
        return {
            id: this.id,
            gbPayAccountID: this.gbPayAccountID,
            gbPayAccountInfo: this.gbPayAccountInfo
        };
    }
    static findAll() {
        const searchQuery = {
            "query": {
                "match_all": {}
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindAll) => {
            if (resultFindAll && resultFindAll.length > 0) {
                return resultFindAll.map((result) => {
                    return new GBPayAccount(result._source);
                });
            }
            else {
                return [];
            }
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let searchQuery = {
                "query": {
                    "bool": {
                        "must": [
                            { "match": { "id": id } }
                        ]
                    }
                }
            };
            Log_1.Log.debug('[GBPayAccount] Finding gbpay account by id with query: ', searchQuery);
            const count = yield ElasticsearchClient_1.ElasticsearchClient.getInstance().count(this.TYPE, searchQuery);
            if (count) {
                return ElasticsearchClient_1.ElasticsearchClient.getInstance().get(this.TYPE, id)
                    .then((resultFindByID) => {
                    Log_1.Log.debug("[GBPayAccount] Result find gbpay account by id: ", resultFindByID);
                    return resultFindByID;
                });
            }
            else {
                Log_1.Log.error("[GBPayAccount] Can't find gbpay account with id: " + id);
                return { "error": "id not found" };
            }
        });
    }
    static findByToken(token) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "gbPayAccountInfo.token.keyword": token } }
                    ]
                }
            }
        };
        Log_1.Log.debug('[GBPayAccount] Finding gbpay account by token');
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindByToken) => {
            Log_1.Log.debug("[GBPayAccount] Result find gbpay account by token: ", resultFindByToken);
            if (resultFindByToken && resultFindByToken.length > 0) {
                return new GBPayAccount(resultFindByToken[0]._source);
            }
            else {
                return {};
            }
        });
    }
    static findByCustomFields(fieldArray) {
        Log_1.Log.debug('[GBPayAccount] Finding gbpay account by customfields with ', fieldArray);
        let searchQuery = {
            "query": {
                "bool": {
                    "must": []
                }
            }
        };
        fieldArray.forEach((fieldObj) => {
            const queryToPush = { "match": { [fieldObj['fieldName']]: fieldObj['fieldValue'] } };
            searchQuery['query']['bool']['must'].push(queryToPush);
        });
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json) => {
            if (json && json.length > 0) {
                Log_1.Log.debug('[GBPayAccount] Result findByCustomFields is ', json);
                return json.map((result) => {
                    return new GBPayAccount(result._source);
                });
            }
            else {
                return [];
            }
        });
    }
    static checkTokenExists(token, tokenListToCheck) {
        return tokenListToCheck.filter((tokenListObj) => {
            return tokenListObj['gbPayAccountInfo']['token'] === token;
        });
    }
    static pushStoreToken(tokenList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Log_1.Log.debug('Starting to push store token..');
                const currentTokenList = yield this.findAll();
                tokenList.forEach((token, index) => {
                    Log_1.Log.debug('Checking token: ' + token + ' is already exists or not...');
                    const resultCheckTokenExists = this.checkTokenExists(token, currentTokenList);
                    if (resultCheckTokenExists.length <= 0) {
                        Log_1.Log.debug('Token: ' + token + ' is not exists, pushing new one...');
                        this.doPushToken(token);
                    }
                    Log_1.Log.debug('Token: ' + token + ' is already exists, skipping...');
                });
                return { "status": "success" };
            }
            catch (error) {
                Log_1.Log.error('Error while pushing store token: ', error);
                throw error;
            }
        });
    }
    static doPushToken(token) {
        return ExternalProxy_1.ExternalProxy.getInstance().sendRequest({
            "method": "POST",
            "uri": "http://localhost:1780/api/gbpayAccount/new",
            "body": {
                "gbPayAccountInfo": {
                    "token": token
                }
            }
        });
    }
}
GBPayAccount.TYPE = "gbpay_account";
exports.GBPayAccount = GBPayAccount;
//# sourceMappingURL=GBPayAccount.js.map