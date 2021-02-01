import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../utils/Log';
import { ExternalProxy } from '../modules/ExternalProxy';

export interface facebookSelectedPageJSON {
    value?: string,
    label?: string
}

export interface ChannelJSON {
    facebook: string,
    facebookSelectedPage?: facebookSelectedPageJSON,
    facebookSelectedPageAccessToken?: string,
    instagram?: string,
    LINE?: string
}

export interface JSONData {
    storeID: string,
    channels: ChannelJSON
}

export class Channel extends AbstractPersistentModel {
    public storeID: string;
    public channels: ChannelJSON;

    constructor(json: JSONData, storeID?: string) {
        super(json.storeID);
        this.storeID = json.storeID;
        this.channels = json.channels
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "sales_channel";
    protected getType(): string {
        return Channel.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            channels: this.channels
        }
    }

    public static findByChannelId(channelID: string) {
        let channelType;
        let searchQuery = {
            "query": {
                "match": {}
            }
        }

        Log.debug('Finding storeID by channel id : ' + channelID);

        if (channelID.startsWith("facebook_")) {
            channelType = "facebook";
            channelID = channelID.replace("facebook_", "");
        } else if (channelID.startsWith("line_")) {
            channelType = "line";
            channelID = channelID.replace("line_", "");
        } else if (channelID.startsWith("instagram_")) {
            channelType = "instagram";
            channelID = channelID.replace("instagram_", "");
        }

        if (channelType.length > 0) {
            searchQuery['query']['match'] = {
                ['channels.' + channelType]: channelID
            }

            return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
                .then((resultFindByChannelID: any) => {
                    Log.debug('resultFindByChannelID: ', resultFindByChannelID);
                    if (resultFindByChannelID && resultFindByChannelID.length > 0) {
                        return resultFindByChannelID.map((result: any) => {
                            return {
                                "storeID": result._source.storeID
                            }
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

    public static findByStoreID(storeID: string) {
        let searchQuery = {
            "query": {
                "match": { "storeID.keyword": storeID }
            }
        }
        
        Log.debug('Finding by channel by store id: ' + storeID);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery, { autoScroll: true })
            .then((resultFindStoreByID: any) => {
                if (resultFindStoreByID && resultFindStoreByID.length > 0) {
                    Log.debug('resultFindStoreByID: ', resultFindStoreByID);
                    return resultFindStoreByID.map((result: any) => {
                        return new Channel(result._source);
                    });
                } else {
                    return [];
                }
            })
            .catch((err: any) => {
                return err;
            });
    }

    public static findAllConnectedPages() {
        let searchQuery = {
            "_source": "channels.facebook", 
            "query": {
                "bool": {
                    "must_not": {
                        "term": { "channels.facebook.keyword": "" }
                    }
                }
            }
        }

        Log.debug('Finding all connected pages');

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultFindAllConnectedPages: any) => {
                if (resultFindAllConnectedPages && resultFindAllConnectedPages.length > 0) {
                    Log.debug('resultFindAllConnectedPages: ', resultFindAllConnectedPages);
                    return resultFindAllConnectedPages.map((result: any) => {
                        return result['_source']['channels']['facebook'];
                    });
                } else {
                    return [];
                }
            })
            .catch((err: any) => {
                Log.error('Error while finding all pages with: ', err);
                throw err;
            });
    }

    public static refreshPageList() {
        Log.debug('Refreshing page list');
        
        return ExternalProxy.getInstance().sendRequest({
            uri: `https://msg.convolab.ai/aris/refresh`,
            method: 'GET'
        });
    }

    public static purgePageList() {
        Log.debug('Purging page list');
        
        return ExternalProxy.getInstance().sendRequest({
            uri: `https://msg.convolab.ai/aris/purge`,
            method: 'GET'
        });
    }

    public static sendCustomMessage(messageObj: { userID: string, message: string }) {
        const INSTANCE_NAME = process.env.INSTANCE_NAME;

        Log.debug('Sending custom message to chatbot with: ', messageObj);

        return ExternalProxy.getInstance().sendRequest({
            uri: `https://${INSTANCE_NAME}.convolab.ai/messagelogic/receiveCustomMsg`,
            method: 'POST',
            body: messageObj
        });
    }
}