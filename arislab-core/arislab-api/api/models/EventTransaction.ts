import {ElasticsearchClient} from "../components/ElasticsearchClient";
import {AbstractPersistentModel} from "./AbstractPersistentModel";
import { Log } from '../ts-utils/Log';

export interface IStreamingInfo {
    name: string,
    description: string,
    videoID: string,
    streamURL: string,
    status: string,
    detail: string,
    eventStartAt: number,
    eventEndAt: number,
    streamingToIpAddress: string,
    products: string[]
}

export interface IEventTransaction {
    eventTransactionID: string,
    eventID: string,
    storeID: string,
    code: string,
    streamingInfo: IStreamingInfo
}

export class EventTransaction extends AbstractPersistentModel {
    public eventTransactionID: string;
    public eventID: string;
    public storeID: string;
    public code: string;
    public streamingInfo: IStreamingInfo;

    constructor(json: IEventTransaction, eventTransactionID?: string) {
        super(eventTransactionID);
        this.eventTransactionID = eventTransactionID;
        if( json ) {
            this.eventID = json.eventID;
            this.storeID = json.storeID;
            this.code = json.code;
            this.streamingInfo = json.streamingInfo;
        }
    }

    doUpdate(json: IEventTransaction): boolean {
        return true;
    }

    private static readonly TYPE = "event_transaction";
    protected getType(): string {
        return EventTransaction.TYPE;
    }

    public toJSON(): IEventTransaction {
        return {
            eventTransactionID: this.eventTransactionID,
            eventID: this.eventID,
            storeID: this.storeID,
            code: this.code,
            streamingInfo: this.streamingInfo,
        }
    }

    public updateJSON(json: IEventTransaction) {
        return new Promise((resolve, reject) => {
            if( json ) {
                this.eventTransactionID = json.eventTransactionID;
                this.eventID = json.eventID;
                this.storeID = json.storeID;
                this.code = json.code;
                this.streamingInfo = json.streamingInfo;

                resolve( this.update(json) );
            } else {
                resolve( false );
            }
        });
        
    }

    public static findEventTransactionFromEventCode(code: string): Promise<IEventTransaction[]> {
        Log.debug('Finding list of event transaction from code: ' + code);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "code.keyword": code
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "streamingInfo.eventStartAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('Result list of event transaction from code: ' + code + ' is: ', json);
                return json.map((result: any) => {
                    return new EventTransaction(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findLastEventTransactionFromEventCode(code: string): Promise<IEventTransaction[]> {
        Log.debug('Finding list of event transaction from code: ' + code);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "code.keyword": code
                            }
                        }
                    ]
                }
            },
            "size": 1,
            "sort": [
                { "streamingInfo.eventStartAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('Result last of event transaction from code: ' + code + ' is: ', json);
                return json.map((result: any) => {
                    return new EventTransaction(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

}
