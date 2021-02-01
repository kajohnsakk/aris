/**
 * Created by touchaponk on 15/07/2017.
 */
import {Router} from 'express';

const fs = require('fs');
const path = require('path');
import {IdentityProvider, ServiceProvider} from 'saml2-js';
import {Log} from '../utils/Log';
import {ApiProxy} from './ApiProxy';
import {Authenticator} from './Authenticator';
import * as _ from "underscore";

export interface SAMLResponseJson {
    type: string,
    user: {
        name_id: string, session_index: string,
        name: string, upn: string, attributes: { [key: string]: string[] }
        email: string
    }
}

export class SAMLService {
    private static service: SAMLService

    public static getInstance() {
        if(!SAMLService.service) SAMLService.service = new SAMLService();
        return SAMLService.service;
    }
    private identityProvider : IdentityProvider;
    private getServiceProvider(hostname: string){
        return new ServiceProvider({
            entity_id: 'https://'+hostname+'/login/metadata.xml',
            private_key: fs.readFileSync(path.join(__dirname, '..','..','sslcert/STAR_convolab_ai.key')).toString(),
            certificate: fs.readFileSync(path.join(__dirname, '..','..', 'sslcert/STAR_convolab_ai_bundle.crt')).toString(),
            assert_endpoint: 'https://'+hostname+'/login/assert',
            allow_unencrypted_assertion: true
        });
    }
    constructor() {
        this.identityProvider = new IdentityProvider({
            sso_login_url: process.env.SAML_LOGIN_URL,
            sso_logout_url: process.env.SAML_LOGOUT_URL,
            certificates: [process.env.SAML_IDP_CERT.replace(/\\n/g, '\n')],
            allow_unencrypted_assertion: true
        });
    }

    public bindRouter(router: Router) {
        Log.debug('Binding SAML Service to router');
        router.get('/metadata.xml', (req: any, res: any) => {
            res.type('application/xml');
            res.send(this.getServiceProvider(req.headers.host).create_metadata());
        });
        router.get('/', (req: any, res: any) => {
            Log.debug('Generating SAML login link');
            this.getServiceProvider(req.headers.host).create_login_request_url(this.identityProvider, {},
                (err: Error, login_url: string) => {
                    if (err != null) {
                        Log.error('Error while getting SAML login url ' + err.stack);
                        return res.send(500);
                    }
                    else {
                        Log.debug('Redirecting to SAML login endpoint at ' + login_url);
                        res.redirect(login_url);
                    }
                });
        });
        // Assert endpoint for when login completes
        router.post('/assert', (req, res) => {
            const options = {request_body: req.body};
            this.getServiceProvider(req.headers.host).post_assert(this.identityProvider, options,
                (err: Error, json: SAMLResponseJson) => {
                    if (err != null) {
                        Log.error('Error from SAML assertion: ', err.stack);
                        return res.send(500);
                    }
                    else {
                        this.onLoggedIn(json, res);
                    }
                });
        });
    }
    private translateRole(inputRole: string){
        // Role mapping is in format <ROLE1=CONVOLAB_ROLE1,CONVOLAB_ROLE2,...;ROLE2=.....>
        const roleMapping = process.env.SAML_ROLES_MAPPING;
        if(!roleMapping) throw new Error('Role mapping is not available');
        const roleArray = roleMapping.split(';').map((r)=>{return r.trim()});
        Log.debug("Role mapping: ",roleArray);
        for(let roleString of roleArray){
            const roleKeyValuePair = roleString.split('=');
            const externalRoleName = roleKeyValuePair[0].trim().toLowerCase();
            if(externalRoleName == inputRole.trim().toLowerCase())
                return roleKeyValuePair[1].split(',').map(r=>{return r.trim().toLowerCase()}).filter((r)=>{ return !!r});
        }
        throw new Error('Invalid role: '+inputRole);
    }
    private onLoggedIn(json: SAMLResponseJson, res: any) {
        Log.debug('SAML response: ', json);
        const defaultPassword = '1qazZAQ!';
        const email = json.user[(process.env.SAML_EMAIL_ATTRIBUTE as 'name_id'|'email') || 'email'];
        let roles:string[] = [];
        for(let attrKey in json.user.attributes) {
            if (attrKey == (process.env.SAML_ROLES_ATTRIBUTE || 'roles'))
                roles = json.user.attributes[attrKey];
        }
        Log.debug("Translating user "+json.user.name_id+" roles="+roles);
        roles = _.flatten(roles.map((role)=>{
            return this.translateRole(role);
        }));
        ApiProxy.getInstance().sendRequest('GET', '/members/' + email)
            .then((json) => {
                Log.debug('member json ', json);
            })
            .catch((err: any) => {
                if (err.statusCode == 404) {
                    // let roles : string[] = [];
                    // if(process.env.SAML_ADMIN_ID == email){
                    //     Log.debug('User ID is configured as admin, promoting to admin');
                    //     roles.push('admin');
                    // }
                    // else{
                    //     for(let attrKey in json.user.attributes){
                    //         if(attrKey.endsWith(`/${process.env.SAML_ROLES_ATTRIBUTE || 'roles'}`))
                    //             roles = json.user.attributes[attrKey];
                    //     }
                    //     if(roles.length == 0)
                    //         roles.push((process.env.SAML_NEW_MEMBER_ROLE || 'agent').toLowerCase().trim());
                    // }
                    const memberJson = {
                        name: (json.user.name || json.user.name_id).replace(/[\W_]+/g,""),
                        id: email,
                        roles: roles,
                        password: defaultPassword,
                        bots: ['origin']
                    };
                    Log.debug('member ' + email + ' doesn\'t exist, creating new member', memberJson);
                    return ApiProxy.getInstance().sendRequest('POST', '/members?phrase='+process.env.npwd, memberJson);
                }
                else throw err;
            })
            .then(() => {
                try{
                    Log.debug("Translated user "+json.user.name_id+"roles into "+roles+", updating to member data");
                    return ApiProxy.getInstance().sendRequest('PUT', '/members/'+email+'?phrase='+process.env.npwd, {
                        roles: roles
                    });
                }
                catch(err){
                    return Promise.reject(err);
                }
            })
            .then(() => {
                Log.debug("Issuing token for member "+email);
                return Authenticator.getInstance().issueNewToken(email, defaultPassword, res, true);
            })
            .then(() => {
                Log.debug("token issued for "+email+", redirecting to root");
                res.redirect('/');
            }).catch(err=>{
                Log.error("Error while logging in: "+err);
                res.send("Error while logging in: "+ err);
                // res.redirect('/logout');
        })
    }
}