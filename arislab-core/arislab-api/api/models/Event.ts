import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';
import { json } from 'body-parser';

export interface EventFacebookJsonData {
    videoID: string,
    streamURL: string,
    streamKey: string
}

export interface JSONData {
    eventID: string,
    storeID: string,
    name: string,
    description: string,
    videoOrientation: string,
    createAt: string,
    eventStartAt: string,
    eventEndAt: string,
    streamingToIpAddress?: string,
    code: string,
    facebookData: EventFacebookJsonData,
    // facebookStreamKey: string,
    products: Array<string>
}

export class Event extends AbstractPersistentModel {
    public eventID: string;
    public storeID: string;
    public name: string;
    public description: string;
    public videoOrientation: string;
    public createAt: string;
    public eventStartAt: string;
    public eventEndAt: string;
    public streamingToIpAddress?: string;
    public code: string;
    public facebookData: EventFacebookJsonData;
    // public facebookStreamKey: string;
    public products: Array<string>;

    constructor(json: JSONData, eventID?: string) {
        super(eventID);
        this.eventID = eventID;
        if (json) {
            this.storeID = json.storeID;
            this.name = json.name;
            this.description = json.description;
            this.videoOrientation = json.videoOrientation;
            this.createAt = json.createAt;
            this.eventStartAt = json.eventStartAt;
            this.eventEndAt = json.eventEndAt;
            this.streamingToIpAddress = json.streamingToIpAddress;
            this.code = json.code;
            this.facebookData = json.facebookData;
            // this.facebookStreamKey = json.facebookStreamKey;
            this.products = json.products;
        }

    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "event";
    protected getType(): string {
        return Event.TYPE;
    }

    public toJSON(): any {
        return {
            eventID: this.eventID,
            storeID: this.storeID,
            name: this.name,
            description: this.description,
            videoOrientation: this.videoOrientation,
            createAt: this.createAt,
            eventStartAt: this.eventStartAt,
            eventEndAt: this.eventEndAt,
            streamingToIpAddress: this.streamingToIpAddress,
            code: this.code,
            facebookData: this.facebookData,
            // facebookStreamKey: this.facebookStreamKey,
            products: this.products
        }
    }

    public static findStoreEventList(storeID: string): Promise<Event[]> {
        Log.debug('Finding list of events in storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        },
                        // {
                        //     "match": {
                        //         "eventStartAt.keyword": ""
                        //     }
                        // }
                    ]
                }
            },
            "sort": [
                { "createAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('Result list of events in storeID: ' + storeID + ' is: ', json);
                return json.map((result: any) => {
                    return new Event(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findEventInfo(storeID: string, eventID: string): Promise<Event> {
        Log.debug('Finding event info of eventID: ' + eventID + ' in storeID: ' + storeID);
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        },
                        {
                            "match": {
                                "_id": eventID
                            }
                        }
                    ]
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('Result event info of eventID: ' + eventID + ' in storeID: ' + storeID + ' is: ', json);
                return json.map((result: any) => {
                    return new Event(result._source);
                });
            } else {
                return [];
            }
        });
    }

    public static findEventInfoFromCode(code: string): Promise<Event> {
        Log.debug('Finding event info from code: ' + code);
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "code": code
                            }
                        }
                    ]
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('Result event info from code: ' + code + ' result is: ' + json);
                return json.map((result: any) => {
                    return new Event(result._source);
                });
            } else {
                return [];
            }
        });
    }
}