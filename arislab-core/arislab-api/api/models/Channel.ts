import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';
import { Utils } from '../ts-utils/Utils';
import { AsyncForEach } from '../ts-utils/AsyncForEach';
import { ExternalProxy, ExternalRequestOption } from '../modules/ExternalProxy';

import * as AppConfig from '../config/AppConfig';

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
                "match": {
                    "storeID": storeID
                }
            }
        }

        Log.debug('Finding by channel by store id: ' + storeID);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
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

    public static async refreshPageList() {
        Log.debug('Refreshing page list');

        // const MSG_REFRESH_URL = process.env.MSG_REFRESH_URL || "https://msg.convolab.ai/aris/refresh";
        let promises: Promise<any>[] = [];
        let MSG_HOST_LIST: string[] = [
            "http://msg-aws-sea01.convolab.ai",
            "http://hooks.eu-gb.mybluemix.net",
            "https://msg.convolab.ai"
        ];

        const MSG_REFRESH_PATH = process.env.MSG_REFRESH_PATH || "aris";

        if (process.env.MSG_HOST_LIST) MSG_HOST_LIST = process.env.MSG_HOST_LIST.split(",");

        MSG_HOST_LIST.forEach((host: string) => {
            const reqObj = ExternalProxy.getInstance().sendRequest({
                uri: `${host}/${MSG_REFRESH_PATH}/refresh`,
                method: 'GET'
            });
            promises.push(reqObj);
        });

        return Promise.all(promises).then((result) => {
            let returnObj: { [key: string]: any } = { "result": result };
            if (!Utils.findDuplicate(result)) {
                returnObj['result'] = "success";
            }
            return returnObj;
        });
    }

    public static async purgePageList() {
        Log.debug('Purging page list');

        // const MSG_PURGE_URL = process.env.MSG_PURGE_URL || "https://msg.convolab.ai/aris/purge";
        let promises: Promise<any>[] = [];
        let MSG_HOST_LIST: string[] = [
            "http://msg-aws-sea01.convolab.ai",
            "http://hooks.eu-gb.mybluemix.net",
            "https://msg.convolab.ai"
        ];

        const MSG_REFRESH_PATH = process.env.MSG_REFRESH_PATH || "aris";

        if (process.env.MSG_HOST_LIST) MSG_HOST_LIST = process.env.MSG_HOST_LIST.split(",");

        MSG_HOST_LIST.forEach((host: string) => {
            const reqObj = ExternalProxy.getInstance().sendRequest({
                uri: `${host}/${MSG_REFRESH_PATH}/purge`,
                method: 'GET'
            });
            promises.push(reqObj);
        });

        return Promise.all(promises).then((result) => {
            let returnObj: { [key: string]: any } = { "result": result };
            if (!Utils.findDuplicate(result)) {
                returnObj['result'] = "success";
            }
            return returnObj;
        });
    }

    public static sendCustomMessage(messageObj: { userID: string, message: string }) {
        const INSTANCE_NAME = process.env.INSTANCE_NAME || AppConfig.INSTANCE_NAME;

        Log.debug('Sending custom message to chatbot with: ', messageObj);

        return ExternalProxy.getInstance().sendRequest({
            uri: `https://${INSTANCE_NAME}.convolab.ai/messagelogic/receiveCustomMsg`,
            method: 'POST',
            body: messageObj
        });
    }

    public static refreshFlow() {
        const INSTANCE_NAME = process.env.INSTANCE_NAME || AppConfig.INSTANCE_NAME;

        Log.debug('Refreshing flow of chatbot instance: ' + INSTANCE_NAME);

        return ExternalProxy.getInstance().sendRequest({
            uri: `https://${INSTANCE_NAME}.convolab.ai/messagelogic/refreshFlow`,
            method: 'GET'
        });
    }

    public static async getAppAccessToken(): Promise<{ [key: string]: string }> {
        try {
            const resultAppAccessToken = await ExternalProxy.getInstance().sendRequest({
                uri: `https://graph.facebook.com/oauth/access_token?client_id=${process.env.PLATFORM_FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`,
                method: 'GET'
            })

            return Promise.resolve(resultAppAccessToken);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static findChannelByPageId(pageid: String) {
        Log.debug('Finding channel by page Id ', pageid);
        let searchQuery = {
            "query": {
                "match": {
                  "channels.facebook.keyword": pageid
                }
            }
        }
        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
        .then((resultFindChannelByPageId: any) => {
            Log.debug("Result find Channel By Page Id ",resultFindChannelByPageId)
            if(resultFindChannelByPageId.length > 0)
                return resultFindChannelByPageId[0]['_source'];
            return false;
        }).catch((err) => {
            Log.debug('Error while finding channel by page id: ', err);
            throw err;
        });
    }

    public static async validatePageToken(token: string) {
        Log.debug('Validating page token');

        let appAccessToken = await this.getAppAccessToken()

        return ExternalProxy.getInstance().sendRequest({
            uri: `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appAccessToken['access_token']}`,
            method: 'GET'
        });
    }

    public static async loadUserInfo(psid: string, token: string) {
        Log.debug('Loading user info from facebook with psid: ' + psid);

        try {
            const resultLoadUserInfo = await ExternalProxy.getInstance().sendRequest({
                uri: `https://graph.facebook.com/${psid}?fields=first_name,last_name&access_token=${token}`,
                method: 'GET'
            });

            Log.debug('resultLoadUserInfo from facebook with psid: ' + psid + ' is: ', resultLoadUserInfo);
            return Promise.resolve(resultLoadUserInfo);
        } catch (error) {
            Log.error('Error while loading user info from facebook with psid: ' + psid);
            return Promise.reject(error);
        }
    }
}