import { Router } from 'express';
import Cryptr = require('cryptr');

const fs = require('fs');
const path = require('path');

import { AuthenticatorUtility } from './AuthenticatorUtility';
import { ApiProxy } from './ApiProxy';
import { IdentityProvider, ServiceProvider } from 'saml2-js';
import { Log } from '../utils/Log';
import { UserManager } from "./UserManager";
import * as AppConfig from '../config/AppConfig';
import { json } from 'body-parser';

const SAML_LOGIN_URL = `https://${process.env.AUTH0_DOMAIN}/samlp/${process.env.AUTH0_CLIENT_ID}`;
const SAML_LOGOUT_URL = `https://${process.env.AUTH0_DOMAIN}/samlp/${process.env.AUTH0_CLIENT_ID}`;
const SAML_IDP_CERT = fs.readFileSync(path.join(__dirname, '..', '..', `sslcert/${process.env.AUTH0_SAML_IDP_CERT_FILE}`)).toString();

const REDIRECT_URL = process.env.WEB_URL || AppConfig.WEB_URL;

export interface SAMLResponseJson {
    type: string,
    user: {
        name_id: string, session_index: string,
        name: string, upn: string,
        email: string,
        attributes: {
            'http://schemas.auth0.com/identities/default/access_token': string[]
        }
    }
}

export interface cookieObj {
    cookieName: string,
    cookieValue: any
}

export class SAMLService {
    private static service: SAMLService;

    public static getInstance() {
        if (!SAMLService.service) SAMLService.service = new SAMLService();
        return SAMLService.service;
    }
    private identityProvider: IdentityProvider;
    protected SECRET_KEY: Cryptr;

    private getServiceProvider(hostname: string) {
        let USE_HTTPS = process.env.SAML_USE_HTTPS || "YES";
        let protocol = (USE_HTTPS === "YES" ? 'https://' : 'http://');

        Log.debug('[SAMLService] protocol is ', protocol);

        return new ServiceProvider({
            entity_id: protocol + hostname + '/login/metadata.xml',
            private_key: fs.readFileSync(path.join(__dirname, '..', '..', 'sslcert/STAR_convolab_ai.key')).toString(),
            certificate: fs.readFileSync(path.join(__dirname, '..', '..', 'sslcert/STAR_convolab_ai_bundle.crt')).toString(),
            assert_endpoint: protocol + hostname + '/login/assert',
            allow_unencrypted_assertion: true
        });
    }
    constructor() {
        this.identityProvider = new IdentityProvider({
            sso_login_url: SAML_LOGIN_URL + '',
            sso_logout_url: SAML_LOGOUT_URL + '',
            certificates: [(SAML_IDP_CERT + '').replace(/\\n/g, '\n')],
            allow_unencrypted_assertion: true
        });
        this.SECRET_KEY = new Cryptr('@R!$LAB');
    }

    public bindRouter(router: Router) {
        Log.debug('Binding SAML Service to router');

        router.get('/metadata.xml', (req: any, res: any) => {
            res.type('application/xml');
            Log.debug(res.send(this.getServiceProvider(req.headers.host).create_metadata()))
            res.send(this.getServiceProvider(req.headers.host).create_metadata());
        });

        router.get('/', (req: any, res: any) => {
            Log.debug('Generating SAML login link');

            this.getServiceProvider(req.headers.host).create_login_request_url(this.identityProvider, {},
                (err: Error, login_url: string, request_id: string) => {
                    if (err != null) {
                        Log.error('Error while getting SAML login url ' + err.stack);
                        return res.send(500);
                    }
                    else {
                        // Log.debug('Redirecting to SAML login endpoint at ' + login_url);
                        // res.redirect(login_url);
                        
                        if (!UserManager.getTokenInfo(req.cookies.token)) {
                            res.render('login', { layout: false, domain: process.env.AUTH0_DOMAIN, clientID: process.env.AUTH0_CLIENT_ID })
                        } else {
                            res.redirect(REDIRECT_URL);
                        }
                    }
                });
        });
        // Assert endpoint for when login completes
        router.post('/assert', (req: any, res: any) => {
            let data = JSON.stringify(req.body);
            let dataObj = JSON.parse(data);
            Log.debug("SAML asset callback received: ", dataObj);

            // Log.debug("THIS IS NAME EXAMPLE", req.body.idTokenPayload);
            // const options = { request_body: req.body };
            // this.getServiceProvider(req.headers.host).post_assert(this.identityProvider, options,
            //     (err: Error, json: SAMLResponseJson) => {
            //         if (err != null) {
            //             Log.error('Error from SAML assertion: ', err.stack + ' + err obj: ', err + " samlresponse is ", json);
            //             return res.send(500);
            //         }
            //         else {
            //             Log.debug(json)
            //             this.onLoggedIn(json, res);
            //         }    
            //     });
            this.onLoggedIn(dataObj, res)
        });
    }

    // private onLoggedIn(json: SAMLResponseJson, res: any) {
    private async onLoggedIn(data: any, res: any) {
        try {
            Log.debug('SAML response: ', data);
            const access_token = data['access_token'];
            const token = data['id_token']

            const auth0UserInfo = await AuthenticatorUtility.getAuth0UserInfo(access_token);

            Log.debug('auth0UserInfo', auth0UserInfo);

            const userInfo = {
                user_id: auth0UserInfo['sub'],
                email: auth0UserInfo['email'],
                fullName: auth0UserInfo['name']
            }

            // const token = data["accessToken"];
            // const userInfo = {
            //     user_id: data["idTokenPayload[sub]"],
            //     email: data["idTokenPayload[email]"],
            //     fullName: data["idTokenPayload[name]"]
            // };


            Log.debug('onLoggedIn token is', token);

            UserManager.registerTokenInfo(token, userInfo);
            Log.debug('User ', userInfo, ' successfully authenticated');

            // Check user by auth0 UID method
            ApiProxy.getInstance().sendRequest("GET", `/utility/checkStore/uid/${userInfo.user_id}`)
                .then((resultCheckStore: any) => {
                    Log.debug("REULSE CHECK STORE: ====> ", resultCheckStore);
                    if (resultCheckStore.found === false) {
                        Log.debug('No store id linked with this user id: ', userInfo.user_id, ' creating new store id');

                        let initStoreBody = {
                            user_id: userInfo.user_id,
                            email: userInfo.email,
                            name: userInfo.fullName
                        };

                        this.initStore(initStoreBody)
                            .then((resultInitStore: any) => {
                                Log.debug('New store created successful with initial result: ', resultInitStore);
                            })
                            .catch((error: any) => {
                                Log.error('Error while creating new store with error: ', error);
                                throw error;
                            });
                    }
                })

            let tempTokenInfo = UserManager.getTokenInfo(token);

            Log.debug('tempTokenInfo ', tempTokenInfo);

            let cookieList: cookieObj[] = [
                {
                    cookieName: "auth0_uid",
                    cookieValue: userInfo['user_id']
                },
                {
                    cookieName: "token",
                    cookieValue: token
                },
                {
                    cookieName: "isLoggedIn",
                    cookieValue: true
                }
            ]

            // Log.debug('THIS IS COOKIEEE ==> ', cookieList)

            if (userInfo.email) {
                let encryptedEmail = this.SECRET_KEY.encrypt(userInfo.email);
                cookieList.push({
                    cookieName: "email",
                    cookieValue: encryptedEmail
                })
            }

            this.setCookie(res, cookieList, true)
            res.redirect(REDIRECT_URL);
        } catch (error) {
            Log.error('[onLoggedIn] Error: ', error);
            throw error;
        }
    }

    private async initStore(initStoreBody: { user_id: string, email: string, name: string }) {
        try {
            Log.debug('Initing store with body: ', initStoreBody);

            const resultInitStore = await ApiProxy.getInstance().sendRequest("POST", "/utility/initStore/", initStoreBody);
            if (resultInitStore.hasOwnProperty('storeID')) {
                let storeID = resultInitStore['storeID'];

                return Promise.all([this.initChatbotConfig(storeID), this.initSalesChannel(storeID)])
                    .then((resultInitAllConfig) => {
                        Log.debug('resultInitAllConfig: ', resultInitAllConfig);
                        return resultInitAllConfig;
                    })
                    .catch((error) => {
                        Log.error('Error while initing all config ', error);
                        throw error;
                    });
            }
        }
        catch (error) {
            Log.error('Error while initing store ', error);
            throw error;
        }
    }

    private async initChatbotConfig(storeID: string) {
        try {
            Log.debug('Initing chatbot config for storeID: ' + storeID);
            const resultInitChatbotConfig = await ApiProxy.getInstance().sendRequest("POST", `/utility/initChatbotConfig/storeID/${storeID}`);
            Log.debug('resultInitChatbotConfig: ', resultInitChatbotConfig);
            return resultInitChatbotConfig;
        }
        catch (error) {
            Log.error('Error while initing chatbot config ', error);
            throw error;
        }
    }

    private async initSalesChannel(storeID: string) {
        try {
            Log.debug('Initing sales channel config for storeID: ' + storeID);
            const resultInitSalesChannel = await ApiProxy.getInstance().sendRequest("POST", `/utility/initSalesChannel/storeID/${storeID}`);
            Log.debug('resultInitSalesChannel: ', resultInitSalesChannel);
            return resultInitSalesChannel;
        }
        catch (error) {
            Log.error('Error while initing sales channel ', error);
            throw error;
        }
    }

    public setCookie(res: any, cookieObj: cookieObj[], set_to_main_domain?: boolean) {
        let cookieOption: any = {
            httpOnly: false,
            secure: true
        };

        if (set_to_main_domain) {
            // Set cookie to current domain, then set it again for ".arislab.ai"
            this.setCookie(res, cookieObj);
            cookieOption['domain'] = ".arislab.ai";
        }

        return cookieObj.forEach((cookie) => {
            res.cookie(cookie['cookieName'], cookie['cookieValue'], cookieOption)
        });
    }
}