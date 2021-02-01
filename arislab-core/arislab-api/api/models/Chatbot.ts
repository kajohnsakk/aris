import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface ChatbotConfig {
    general: object,
    message: object
}

export interface JSONData {
    storeID: string,
    config: ChatbotConfig;
}

export class Chatbot extends AbstractPersistentModel {
    public storeID: string;
    public config: ChatbotConfig

    constructor(json: JSONData) {
        super(json.storeID);
        this.storeID = json.storeID;
        this.config = json.config;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "chatbotConfig";
    protected getType(): string {
        return Chatbot.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            config: this.config
        }
    }

    public static findByStoreID(storeID: string) {
        let searchQuery = {
            "query": {
                "match": {
                    "storeID": storeID
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindStoreByID: any) => {
                if (resultFindStoreByID && resultFindStoreByID.length > 0) {
                    return resultFindStoreByID.map((result: any) => {
                        return new Chatbot(result._source);
                    });
                } else {
                    return [];
                }
            })
            .catch((err: any) => {
                return err;
            });
    }
}