import { Log } from '../ts-utils/Log';
import { ErrorObject } from '../ts-utils/ErrorObject';
const requestPromise = require('request-promise-native');
import querystring from "querystring";
import { ExternalProxy } from '../modules/ExternalProxy';
import { JSONData as ChannelJSON, Channel } from '../models/Channel';
import { JSONData as StoreConfigJSON, StoreConfig } from '../models/StoreConfig';
import * as AppConfig from '../config/AppConfig';

export interface FacebookPageJson { id: string, access_token: string, name: string, page_token: string, fan_count: number }
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();

// Instance configuration
const INSTANCE_NAME = process.env.INSTANCE_NAME || AppConfig.INSTANCE_NAME;
const INSTANCE_EMAIL = process.env.INSTANCE_EMAIL || AppConfig.INSTANCE_EMAIL;
const INSTANCE_PASS = process.env.INSTANCE_PASS || AppConfig.INSTANCE_PASS;
const IS_SCALE_BOT = process.env.IS_SCALE_BOT === 'true' || false;

/**
 * Retrieve facebook pages of a given token
 */

const platformLogin = () => {
    const PLATFORM_URL = `https://${INSTANCE_NAME}.convolab.ai/`;
    let requestBody = {
        email: INSTANCE_EMAIL,
        password: INSTANCE_PASS
    }

    return ExternalProxy.getInstance().sendRequest({
        uri: PLATFORM_URL + "login",
        body: requestBody,
        method: "POST",
        resolveWithFullResponse: true
    });
}

const writeConvolabChannel = (channelID: string, channelBody: object) => {
    Log.debug('Writing new channel to database with channelID: ' + channelID + ' and body: ', channelBody);
    const INDEX = `njoin-${INSTANCE_NAME}`
    const ES_ENDPOINT = `https://${process.env.nes}/${INDEX}`;

    return ExternalProxy.getInstance().sendRequest({
        uri: `${ES_ENDPOINT}/channel/${channelID}`,
        body: channelBody,
        json: true,
        method: 'PUT'
    });
}

const getLoginCookies = (loginResult: string[]) => {
    var indexValue = loginResult.findIndex(function (currentValue: string) {
        return currentValue.startsWith("token");
    });
    if (!indexValue) {
        indexValue = 0;
    }
    let loginCookies = loginResult[indexValue];
    return loginCookies;
}

const deployConvolabChannel = (channelID: string, body: object) => {
    Log.debug('Deploying written channelID: ' + channelID + ' and body: ', body, ' to convolab instance ');

    const PLATFORM_URL = `https://${INSTANCE_NAME}.convolab.ai/api/`;

    return new Promise((resolve, reject) => {
        platformLogin()
            .then((resultLogin: any) => {
                let loginCookies = getLoginCookies(resultLogin.headers['set-cookie']);

                return ExternalProxy.getInstance().sendRequest({
                    uri: PLATFORM_URL + "bots/origin/channels/" + channelID,
                    method: "POST",
                    headers: {
                        Cookie: loginCookies
                    },
                    body: body
                })
                    .then((resultUpdateChannel: any) => {
                        resolve(resultUpdateChannel);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            });
    })

}

router.get('/facebook/pages', (req: Request, res: Response) => {
    const token = req.query.token;
    const userId = req.query.userId;
    if (!token || !userId) {
        ErrorObject.BAD_REQUEST.send(res);
    } else {
        const FACEBOOK_CLIENTID = process.env.PLATFORM_FACEBOOK_APP_ID || "502170539988549";
        const FACEBOOK_CLIENTSECRET = process.env.FACEBOOK_APP_SECRET || "73fc7474f3879738ac173d845c473930";

        requestPromise({
            uri: "https://graph.facebook.com/v2.12/oauth/access_token?grant_type=fb_exchange_token&client_id=" + FACEBOOK_CLIENTID + "&" +
                "client_secret=" + FACEBOOK_CLIENTSECRET + "&fb_exchange_token=" + token,
            method: "GET",
            json: true
        }).then((auth: { access_token: string, expires_in: number, machine_id: string }) => {
            const token = auth.access_token;
            Log.debug("token is ", token);
            return ExternalProxy.getInstance().sendRequest({
                uri: "https://graph.facebook.com/v2.12/" + userId + "/accounts?access_token=" + token + "&limit=500",
                method: "GET"
            })
        }).then((json: { data: FacebookPageJson[] }) => {
            res.json(json.data);
        });
    }
});

router.post('/storeID/:storeID/update', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let updateData: ChannelJSON;
    let requestBody = req.body;

    updateData = {
        storeID: storeID,
        channels: requestBody
    }

    Log.debug('Updating sales channel of storeID ' + storeID + ' with body:', updateData);
    res.end();

    let updateObj = new Channel(updateData);
    return updateObj.update(updateData).then(() => {
        if (IS_SCALE_BOT === true) {
            setTimeout(() => {
                Log.debug('Refreshing page list and flow')
                Promise.all([Channel.refreshPageList(), Channel.refreshFlow()])
                    .then((resultRefreshAll: any) => {
                        Log.debug('Result refresh page list and flow : ', resultRefreshAll);
                        return resultRefreshAll;
                    });
            }, 2000);
        }
    });

});

router.get('/storeID/:storeID/details', (req: Request, res: Response) => {
    let storeID = req.params.storeID;

    Channel.findByStoreID(storeID).then((resultFindByStoreID: any) => {
        res.send(resultFindByStoreID);
        res.end();
    });
});

router.get('/channelID/:channelID/details', (req: Request, res: Response) => {
    let channelID = req.params.channelID;

    Channel.findByChannelId(channelID).then((resultFindByChannelID: any) => {
        res.send(resultFindByChannelID);
        res.end();
    });
});

router.get('/channelID/:channelID/storeDetails', (req: Request, res: Response) => {
    let channelID = req.params.channelID;

    Channel.findByChannelId(channelID).then((resultFindByChannelID: any) => {
        let storeID = resultFindByChannelID[0].storeID;
        StoreConfig.findById(storeID).then((resultFindByID) => {
            res.send(resultFindByID);
            res.end();
        });
    });
});

router.post('/cvl-platform/update', (req: Request, res: Response) => {
    const channelID = req.query.channelID;
    const body = req.body;

    res.json({ 'result': 'success' });

    writeConvolabChannel(channelID, body)
        .then((resultWriteConvolabChannel: object) => {
            Log.debug('resultWriteConvolabChannel', resultWriteConvolabChannel);
            deployConvolabChannel(channelID, body)
                .then((resultDeployConvolabChannel: any) => {
                    Log.debug('ChannelID ' + channelID + ' and body: ', body, ' was deployed with result: ', resultDeployConvolabChannel);
                    // res.send(resultDeployConvolabChannel);
                    // return Promise.all([resultDeployConvolabChannel, Channel.refreshPageList()])
                    //     .then((resultAllPromise: any) => {
                    //         res.send(resultDeployConvolabChannel);
                    //     });
                })
                .catch((error: object) => {
                    Log.error('deployConvolabChannel error', error)
                    return error;
                });
        })
        .catch((error: object) => {
            Log.error('resultWriteConvolabChannel error', error)
            return error;
        })
});

router.get('/cvl-platform/channelID/:channelID/details', (req: Request, res: Response) => {
    const PLATFORM_URL = `https://${INSTANCE_NAME}.convolab.ai/api/`;
    const channelID = req.params.channelID;

    platformLogin()
        .then((resultLogin: any) => {
            let loginCookies = getLoginCookies(resultLogin.headers['set-cookie']);

            return ExternalProxy.getInstance().sendRequest({
                uri: PLATFORM_URL + "bots/origin/channels/" + channelID,
                method: "GET",
                headers: {
                    Cookie: loginCookies
                }
            })
                .then((resultGetChannel: any) => {
                    res.send(resultGetChannel);
                })
                .catch((err: any) => {
                    res.send(err);
                });
        })
        .catch((err: any) => {
            return err;
        });
});

router.post('/cvl-platform/channelID/:channelID/delete', (req: Request, res: Response) => {
    const PLATFORM_URL = `https://${INSTANCE_NAME}.convolab.ai/api/`;
    const channelID = req.params.channelID;

    if (channelID == 'undefined') res.json({});
    Log.debug("Request before call api is: ", req.params);

    platformLogin()
        .then((resultLogin: any) => {
            let loginCookies = getLoginCookies(resultLogin.headers['set-cookie']);

            Log.debug("Call api to " + PLATFORM_URL + "bots/origin/channels/" + channelID + " with DELETE method and Cookie: " + loginCookies);
            res.json({ result: 'success' });

            return ExternalProxy.getInstance().sendRequest({
                uri: PLATFORM_URL + "bots/origin/channels/" + channelID,
                method: "DELETE",
                headers: {
                    Cookie: loginCookies
                }
            })
                .then((resultDeleteChannel: any) => {
                    Log.debug("resultDeleteChannel: ", resultDeleteChannel);
                    // res.send(resultDeleteChannel);
                })
                .catch((err: any) => {
                    Log.error("Error: ", err);
                    // res.send(err);
                });
        })
        .catch((err: any) => {
            return err;
        });
});

router.post('/sendCustomMessage', (req: Request, res: Response) => {
    let userID = req.body.userID;
    let message = req.body.message;

    if (!userID && message) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        let messageObj = {
            userID: userID,
            message: message
        };

        Channel.sendCustomMessage(messageObj)
            .then((resultSendCustomMessage: any) => {
                res.send(resultSendCustomMessage);
                res.end();
            });
    }
});

router.get('/pages', (req: Request, res: Response) => {
    Channel.findAllConnectedPages()
        .then((resultFindAllPages: Array<string>) => {
            res.send(resultFindAllPages);
            res.end();
        });
});

router.get('/refreshPage', (req: Request, res: Response) => {
    Channel.refreshPageList()
        .then((resultRefreshPageList) => {
            res.send(resultRefreshPageList);
            res.end();
        });
});

router.get('/purgePage', (req: Request, res: Response) => {
    Channel.purgePageList()
        .then((resultPurgePageList) => {
            res.send(resultPurgePageList);
            res.end();
        });
});

router.get('/refreshFlow', (req: Request, res: Response) => {
    Channel.refreshFlow()
        .then((resultRefreshFlow: any) => {
            res.send(resultRefreshFlow);
            res.end();
        });
});

router.post('/validatePageToken', (req: Request, res: Response) => {
    let pageAccessToken = req.body.token;
    Channel.validatePageToken(pageAccessToken)
        .then((resultValidatePageToken: any) => {
            res.send(resultValidatePageToken);
            res.end();
        });
});

router.get('/loadUserInfo', (req: Request, res: Response) => {
    const psid = req.query.psid;
    const token = req.query.token;

    if (!psid && token) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        Channel.loadUserInfo(psid, token)
            .then((resultLoadUserInfo) => {
                res.send(resultLoadUserInfo);
                res.end();
            });
    }
});

module.exports = router;