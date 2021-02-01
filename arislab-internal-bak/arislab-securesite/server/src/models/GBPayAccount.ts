import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';
import { Log } from '../utils/Log';
import { ExternalProxy } from '../modules/ExternalProxy';

export interface IGBPayAccountInfo {
    name?: string,
    token: string,
    secret_key: string
}

export interface IGBPayAccount {
    id: string,
    gbPayAccountID?: string,
    gbPayAccountInfo: IGBPayAccountInfo
}

export class GBPayAccount extends AbstractPersistentModel {
    public id: string;
    public gbPayAccountID?: string;
    public gbPayAccountInfo: IGBPayAccountInfo;
    
    constructor(json: IGBPayAccount, id?: string) {
        super(id);
        this.id = json.id;
        this.gbPayAccountID = json.gbPayAccountID || "";
        this.gbPayAccountInfo = json.gbPayAccountInfo;
    }

    doUpdate(json: IGBPayAccount): boolean {
        return true;
    }

    private static readonly TYPE = "gbpay_account";
    protected getType(): string {
        return GBPayAccount.TYPE;
    }

    public toJSON(): any {
        return {
            id: this.id,
            gbPayAccountID: this.gbPayAccountID,
            gbPayAccountInfo: this.gbPayAccountInfo
        }
    }

    public static findAll() {
        const searchQuery = {
            "query": {
                "match_all": {}
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindAll) => {
                if (resultFindAll && resultFindAll.length > 0) {
                    return resultFindAll.map((result: any) => {
                        return new GBPayAccount(result._source);
                    });
                } else {
                    return [];
                }
            })
    }

    public static async findById(id: string) {
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "id": id } }
                    ]
                }
            }
        };

        Log.debug('[GBPayAccount] Finding gbpay account by id with query: ', searchQuery);

        const count = await ElasticsearchClient.getInstance().count(this.TYPE, searchQuery);

        if (count) {
            return ElasticsearchClient.getInstance().get(this.TYPE, id)
                .then((resultFindByID) => {
                    Log.debug("[GBPayAccount] Result find gbpay account by id: ", resultFindByID);
                    return resultFindByID;
                });
        } else {
            Log.error("[GBPayAccount] Can't find gbpay account with id: " + id);
            return { "error": "id not found" };
        }
    }

    public static findByToken(token: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "gbPayAccountInfo.token.keyword": token } }
                    ]
                }
            }
        };

        Log.debug('[GBPayAccount] Finding gbpay account by token: ', searchQuery);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindByToken) => {
                Log.debug("[GBPayAccount] Result find gbpay account by token: ", resultFindByToken);
                if (resultFindByToken && resultFindByToken.length > 0) {
                    return new GBPayAccount(resultFindByToken[0]._source)
                } else {
                    return {}
                }
            });
    }

    public static findByCustomFields(fieldArray: Array<{ fieldName: string, fieldValue: string }>): Promise<GBPayAccount[]> {
        Log.debug('[GBPayAccount] Finding gbpay account by customfields with ', fieldArray);

        let searchQuery: { [key: string]: any } = {
            "query": {
                "bool": {
                    "must": []
                }
            }
        }

        fieldArray.forEach((fieldObj) => {
            const queryToPush = { "match": { [fieldObj['fieldName']]: fieldObj['fieldValue'] } }
            searchQuery['query']['bool']['must'].push(queryToPush)
        });

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('[GBPayAccount] Result findByCustomFields is ', json);
                return json.map((result: any) => {
                    return new GBPayAccount(result._source);
                });
            } else {
                return [];
            }
        });
    }

    public static checkTokenExists(token: string, tokenListToCheck: GBPayAccount[]) {
        return tokenListToCheck.filter((tokenListObj: GBPayAccount) => {
            return tokenListObj['gbPayAccountInfo']['token'] === token;
        });
    }

    public static async pushStoreToken(tokenList: Array<string>) {
        try {
            Log.debug('Starting to push store token..');

            const currentTokenList = await this.findAll();
            tokenList.forEach((token: string, index: number) => {
                Log.debug('Checking token: ' + token + ' is already exists or not...')

                const resultCheckTokenExists = this.checkTokenExists(token, currentTokenList);
                if (resultCheckTokenExists.length <= 0) {
                    Log.debug('Token: ' + token + ' is not exists, pushing new one...');
                    this.doPushToken(token);
                }

                Log.debug('Token: ' + token + ' is already exists, skipping...');
            });
            return { "status": "success" };
        } catch (error) {
            Log.error('Error while pushing store token: ', error);
            throw error;
        }
    }

    public static doPushToken(token: string) {
        return ExternalProxy.getInstance().sendRequest({
            "method": "POST",
            "uri": "http://localhost:1780/api/gbpayAccount/new",
            "body": {
                "gbPayAccountInfo": {
                   "token": token
                }
            }
        })
    }
}