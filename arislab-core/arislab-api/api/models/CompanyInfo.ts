import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface storeConfigJSON {
    useCart?: boolean,
    useCashOnDelivery?: boolean,
    useCreditCard?: boolean
}

enum serviceConfigTypeList {
    API
}

export interface serviceConfigJSON {
    type: serviceConfigTypeList,
    name: string,
    value: string,
    userDefined1?: string,
    userDefined2?: string,
    userDefined3?: string,
    userDefined4?: string,
    userDefined5?: string
}

export interface storeInfoJSON {
    config?: storeConfigJSON,
    serviceConfig?: Array<serviceConfigJSON>
}

export interface JSONData {
    storeID: string,
    storeInfo: storeInfoJSON
}

export class StoreConfig extends AbstractPersistentModel {
    public storeID: string;
    public storeInfo: storeInfoJSON;

    constructor(json: JSONData) {
        super(json.storeID);

        // if (!json.storeInfo.hasOwnProperty('serviceConfig')) json.storeInfo['serviceConfig'] = [];
        if (!json.storeInfo.hasOwnProperty('config')) json.storeInfo['config'] = {};

        if (
            json.storeInfo.hasOwnProperty('config') &&
            json.storeInfo.config.hasOwnProperty('useCart') === false
        ) {
            json.storeInfo['config']['useCart'] = false;
        }

        if (
            json.storeInfo.hasOwnProperty('config') &&
            json.storeInfo.config.hasOwnProperty('useCashOnDelivery') === false
        ) {
            json.storeInfo['config']['useCashOnDelivery'] = false;
        }

        if (
            json.storeInfo.hasOwnProperty('config') &&
            json.storeInfo.config.hasOwnProperty('useCreditCard') === false
        ) {
            json.storeInfo['config']['useCreditCard'] = false;
        }

        this.storeID = json.storeID;
        this.storeInfo = json.storeInfo;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "store";
    protected getType(): string {
        return StoreConfig.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            storeInfo: this.storeInfo
        };
    }

    public static findById(storeID: string): Promise<StoreConfig> {
        Log.debug('[StoreConfig] Finding store config by id with storeID: ', storeID);

        return ElasticsearchClient.getInstance().get(this.TYPE, storeID).then((json: any) => {
            if (!json)
                Log.debug('Store ID ' + storeID + " doesn't exist");
            else
                return new StoreConfig(json);
        });
    }

    public static findByToken(token: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "storeInfo.paymentInfo.gbPayInfo.token.keyword": token } }
                    ]
                }
            }
        };

        Log.debug('[StoreConfig] Finding store config by token');

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindByToken) => {
                Log.debug("[StoreConfig] Result find store config by token: ", resultFindByToken);
                if (resultFindByToken && resultFindByToken.length > 0) {
                    return new StoreConfig(resultFindByToken[0]._source)
                } else {
                    return {}
                }
            });
    }

    public static retrieveTokenList(storeList?: Array<string>) {
        let storeListQuery: { [key: string]: any } = {};

        if (storeList.length > 0) {
            storeListQuery['must'] = [];
            storeListQuery['must'].push({
                "terms": {
                    "storeID.keyword": storeList
                }
            })
        }

        const searchQuery = {
            "bool": {
                ...storeListQuery,
                "must_not": [
                    { "terms": { "storeInfo.paymentInfo.gbPayInfo.token.keyword": [""] } }
                ]
            }
        };

        const aggregate = {
            "terms": {
                "field": "storeInfo.paymentInfo.gbPayInfo.token.keyword",
                "size": 1000
            },
            "aggs": {
                "STORE_ID": {
                    "terms": {
                        "field": "storeID.keyword",
                        "size": 1000
                    }
                }
            }
        };

        Log.debug('Retrieving token list with query: ', searchQuery, ' and aggregate : ', aggregate)

        return ElasticsearchClient.getInstance().aggregate(this.TYPE, searchQuery, aggregate)
            .then((resultRetrieveTokenList: { [key: string]: any }) => {
                return resultRetrieveTokenList.filter((token: { key: string, doc_count: number }) => {
                    const tokenRegex = new RegExp(/[A-Za-z0-9+/]/)
                    return token.key.length > 25 && tokenRegex.test(token.key);
                });
            });
    }
}