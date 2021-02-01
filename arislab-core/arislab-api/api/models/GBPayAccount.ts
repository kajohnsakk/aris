import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';
import { Log } from '../ts-utils/Log';

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

        Log.debug('[GBPayAccount] Finding all gbpay account');

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindAll) => {
                if (resultFindAll && resultFindAll.length > 0) {
                    Log.debug("[GBPayAccount] Result find all gbpay account by id: ", resultFindAll);
                    return resultFindAll.map((result) => {
                        return new GBPayAccount(result._source);
                    });
                } else {
                    return [];
                }
            })
    }

    public static async findById(id: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "id.keyword": id } }
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

    public static findByToken(token: string): Promise<IGBPayAccount | {}>{
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "gbPayAccountInfo.token.keyword": token } }
                    ]
                }
            }
        };

        Log.debug('[GBPayAccount] Finding gbpay account by token');

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
}