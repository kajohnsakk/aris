import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { ExternalProxy } from '../modules/ExternalProxy';
import { ElasticsearchClient } from '../components/ElasticsearchClient';
import { Channel } from './Channel';
import { GBPay } from './GBPay';

export class StoreManager {
    public static TYPE = "store";
    private static EXTERNAL_API_HOST = process.env.EXTERNAL_API_HOST;
    private static EXTERNAL_API_PORT = process.env.EXTERNAL_API_PORT;
    private static EXTERNAL_API_URL = `${StoreManager.EXTERNAL_API_HOST}:${StoreManager.EXTERNAL_API_PORT}/api`;

    public static getAllStore() {
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [ { "exists": { "field": "storeID" } } ],
                    "must_not": [ { "term": { "storeID.keyword": "" } }]
                }
            },
			"sort": 
			[
				{
					"email.keyword": { "order": "asc" }
				}
			]
        }
        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (!json)
                    Log.error('Store not available');
                else
                    return json.map((j: any) => {
                        return j['_source'];
                    });
            });
    }

    public static async getStoreInfoByStoreID(storeID: string) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "storeID.keyword": storeID } }
                    ]
                }
            }
        };

        Log.debug('[StoreManager] Getting store info by storeID with query: ', searchQuery);

        const count = await ElasticsearchClient.getInstance().count(this.TYPE, searchQuery);

        if (count) {
            return ElasticsearchClient.getInstance().get(this.TYPE, storeID)
                .then((resultGetStoreInfoByID) => {
                    Log.debug("[StoreManager] Result getting store info by storeID: ", resultGetStoreInfoByID);
                    return resultGetStoreInfoByID;
                });
        } else {
            Log.error("[StoreManager] Can't find storeID: " + storeID);
            return { "error": "id not found" };
        }
    }

    public static listAllStore(from?: number) {
        // let searchOptions = { "size": 3000 };
        let searchOptions = {};
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [ { "exists": { "field": "storeID" } } ],
                    "must_not": [ { "term": { "storeID.keyword": "" } }]
                }
            },
            "sort": [
                { "createdAt": { "order": "asc" } }
            ]
        }

        if (from >= 0) {
            searchOptions['size'] = 20;
            searchOptions['from'] = from;
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery, searchOptions)
            .then((json: any) => {
                if (!json)
                    Log.error('Store not available');
                else
                    return json.map((j: any) => {
                        return j['_source'];
                    });
            }).then(async (sourceArray: any) => {
                return this.pushExtraInfoToStore(sourceArray);
            })
    }

    public static pushExtraInfoToStore(sourceArray: any) {
        return new Promise(async (resolve, reject) => {
            try {
                for (let index = 0; index < sourceArray.length; index++) {
                    const store = sourceArray[index];
                    let resultFindByStoreID: any = await Channel.findByStoreID(store['storeID']);

                    sourceArray[index]['channelInfo'] = {}
                    
                    if (resultFindByStoreID.length > 0) {
                        sourceArray[index]['channelInfo'] = resultFindByStoreID[0]['channels']['facebookSelectedPage'];
                    }

                    if (
                        store.storeInfo.hasOwnProperty('paymentInfo') &&
                        store.storeInfo.paymentInfo.hasOwnProperty('gbPayInfo') &&
                        store.storeInfo.paymentInfo.gbPayInfo.hasOwnProperty('token')
                    ) {
                        // let token = store['storeInfo']['paymentInfo']['gbPayInfo']['token'];

                        // let resultVerifyGBPayToken: any = await GBPay.verifyToken(token);                        
                        // if (resultVerifyGBPayToken.resultCode === "00") {
                        //     sourceArray[index]['verifyGBTokenInfo'] = "VALID";
                        // } else {
                        //     sourceArray[index]['verifyGBTokenInfo'] = "INVALID";
                        // }
                    }
                    ('0' + 11).slice(-2)
                    let createdAt = new Date(sourceArray[index]['createdAt']);
                    let dateCreated = `${('0' + createdAt.getHours()).slice(-2)}:${('0' + createdAt.getMinutes()).slice(-2)} ${('0' + createdAt.getDate()).slice(-2)}/${('0' + (createdAt.getMonth()+1)).slice(-2)}/${createdAt.getFullYear()}`;
                    sourceArray[index]['channelInfo']['dateCreated'] = dateCreated;

                    if (index === sourceArray.length - 1) {
                        resolve(sourceArray);
                    }
                }
            } catch (error) {
                reject(error);
            }
        }).then(() => {
            return sourceArray;
        });
    }

    public static retrieveTokenList(storeList?: Array<string>) {
        let storeListQuery = {};

        if (storeList && storeList.length > 0) {
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