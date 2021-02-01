/**
 * Created by touchaponk on 16/07/2017.
 */
import * as passport from 'passport';
import {Handler} from 'express';
import {ApiProxy} from './ApiProxy';

const log = require('../../utils/log');
import * as rp from 'request-promise-native';
import {IncomingMessage} from 'http';

export interface TokenResponseJson {
    member_id: string,
    bots: string[],
    accounts: string[],
    exp: number,
    roles: string[],
    must_change_password : boolean,
}

export class Authenticator {
    private static readonly ROLES_PERMISSION = [
        { path:"/chatlogic/", method:[], role:["admin", "developer"]},
        { path:"/chatlogic*", method:[], role:["admin", "developer"]},
        { path:"/linklogic", method:[], role:["admin", "developer"]},
        { path:"/linklogic*", method:[], role:[]},
        { path:"/messagelogic", method:["GET"], role:["guest", "admin", "developer"]},
        { path:"/messagelogic", method:[], role:["admin", "developer"]},
        { path:"/console/logs/*log*", method:[], role:["admin", "developer"]},
        { path:"/platform", method:[], role:[]},
        { path:"/api/accounts/.*/persona", method:["GET"], role:[]},
        { path:"/api/accounts/.*/classifications", method:["POST", "PUT", "DELETE"], role:["admin", "developer", "editor"]},
        { path:"/api/accounts*", method:["GET"], role:[]},
        { path:"/api/accounts*", method:["POST", "PUT", "DELETE"], role:["admin"]},
        { path:"/api/tokens*", method:[], role:[]},
        { path:"/api/classifiers*", method:["GET"], role:[]},
        { path:"/api/classifiers*", method:["POST", "PUT", "DELETE"], role:["admin", "developer"]},
        { path:"/api/flows/current/infos", method:["GET"], role:["guest", "admin", "developer", "editor", "analyst", "supervisor"]},
        { path:"/api/flows/current/infos", method:[], role:["admin", "developer", "editor", "analyst", "supervisor"]},
        { path:"/api/flows/current/intents", method:["GET"], role:["guest", "admin", "developer", "editor"]},
        { path:"/api/flows/current/intents", method:[], role:["admin", "developer", "editor"]},
        { path:"/api/flows/current/entities", method:["GET"], role:["guest", "admin", "developer", "editor"]},
        { path:"/api/flows/current/entities", method:[], role:["admin", "developer", "editor"]},
        { path:"/api/flows-linklogic/*", method:[], role:["admin","developer","editor"]},
        { path:"/api/flows/*", method:["GET"], role:[]},
        { path:"/api/flows/*", method:["POST", "PUT", "DELETE"], role:["admin", "developer"]},
        { path:"/api/tickets/stats/summary", method:["GET"], role:["guest", "admin","analyst","supervisor"]},
        { path:"/api/tickets/stats/summary", method:[], role:["admin","analyst","supervisor"]},
        { path:"/api/ticket*", method:["GET"], role:["guest", "admin", "operator", "agent","supervisor"]},
        { path:"/api/ticket*", method:[], role:["admin", "operator", "agent","supervisor"]},
        { path:"/api/users/stats", method:["GET"], role:["guest", "admin","analyst", "supervisor"]},
        { path:"/api/users/stats", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/users/.*/journeys*", method:["GET"], role:["guest", "admin","analyst", "supervisor"]},
        { path:"/api/users/.*/journeys*", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/users/.*/messages", method:["GET"], role:["guest", "admin", "operator", "agent", "supervisor"]},
        { path:"/api/users/.*/messages", method:[], role:["admin", "operator", "agent", "supervisor"]},
        { path:"/api/users/push-message", method:[], role:["admin", "operator", "agent", "supervisor"]},
        { path:"/api/users/.*/saveUserInfo", method:[], role:["admin", "operator", "agent", "supervisor"]},
        { path:"/api/users*", method:[], role:[]},
        { path:"/api/members/.*/change_password", method:[], role:[]},
        { path:"/api/members*", method:[], role:['admin', 'member_manager']},
        { path:"/api/bots/.*/testers*", method:[], role:["admin","developer","guest","editor","moderator"]},
        { path:"/api/bots/.*/campaigns*", method:[], role:["admin","developer","guest","editor","moderator"]},
        { path:"/api/bots/.*/actions*", method:["POST"], role:["admin","developer","operator","agent","supervisor"]},
        { path:"/api/bots/origin*", method:["POST", "PUT", "DELETE"], role:["admin","developer","editor","moderator"]},
        { path:"/api/bots*", method:["GET"], role:[]},
        { path:"/api/bots*", method:["POST", "PUT", "DELETE"], role:["admin", "developer"]},
        { path:"/api/file*", method:["GET"], role:["guest", "admin", "developer"]},
        { path:"/api/file*", method:[], role:["admin", "developer"]},
        { path:"/api/stats*", method:["GET"], role:["guest", "admin", "analyst"]},
        { path:"/api/stats*", method:[], role:["admin", "analyst"]},
        { path:"/api/messages/heatmap", method:["GET"], role:["guest", "admin", "analyst", "supervisor"]},
        { path:"/api/messages/heatmap", method:[], role:["admin", "analyst", "supervisor"]},
        { path:"/api/messages/stats", method:["GET"], role:["guest", "admin","analyst", "supervisor"]},
        { path:"/api/messages/stats", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/messages/.*/search*", method:[], role:["admin", "operator", "agent", "supervisor"]},
        { path:"/api/messages*", method:[], role:[]},
        { path:"/api/confidence/count-group", method:["GET"], role:["guest", "admin", "analyst", "supervisor"]},
        { path:"/api/confidence/count-group", method:[], role:["admin", "analyst", "supervisor"]},
        { path:"/api/confidence*", method:["GET"], role:["guest", "admin", "developer", "editor"]},
        { path:"/api/confidence*", method:[], role:["admin", "developer", "editor"]},
        { path:"/api/conversations/stats", method:["GET"], role:["guest", "admin","analyst", "supervisor"]},
        { path:"/api/conversations/stats", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/conversations/profiles", method:["GET"], role:["admin","guest", "analyst", "supervisor"]},
        { path:"/api/conversations/profiles", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/conversations/.*/profiles", method:["GET"], role:["admin","guest","analyst", "supervisor"]},
        { path:"/api/conversations/.*/profiles", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/conversations/infos", method:["GET"], role:["admin","guest", "analyst", "supervisor"]},
        { path:"/api/conversations/infos", method:[], role:["admin","analyst", "supervisor"]},
        { path:"/api/conversations*", method:[], role:[]},
        { path:"/api/groups", method:["GET"], role:["guest", "admin", "analyst", "supervisor"]},
        { path:"/api/groups", method:[], role:["admin", "analyst", "supervisor"]},
        { path:"/api/tags", method:["GET"], role:["guest", "admin", "analyst", "supervisor", "agent", "operator"]},
        { path:"/api/tags", method:[], role:["admin", "analyst", "supervisor", "agent", "operator"]},
        { path:"/api/housekeeper*", method:["GET"], role:["guest", "admin", "developer"]},
        { path:"/api/housekeeper*", method:[], role:["admin", "developer"]},
        { path:"/api/campaign*", method:[], role:["admin", "developer"]},
        { path:"/api*", method:[], role:[]},
    ];


    private static mAuthenticator: Authenticator = new Authenticator();

    public static getInstance(): Authenticator {
        return this.mAuthenticator;
    }

    public readonly middleware: Handler;
    // public tokenCache: { [key: string]: { exp: number, json: TokenResponseJson } } = {};

    public decryptToken(token: string): Promise<TokenResponseJson> {
        const tokenEndpoint = ApiProxy.getInstance().getRequestOptionWithPath('/tokens/' + token);
        return new Promise((resolve, reject) => {
            rp({
                method: 'GET',
                uri: tokenEndpoint,
                json: true
            }).then((resp: TokenResponseJson) => {
                const now = Date.now()/1000;
                if(now > resp.exp)
                    reject(new Error('Invalid token'));
                else{
                    // this.tokenCache[token] = {json: resp, exp: new Date().getTime() + 10000};
                    resolve(resp);
                }
            }).catch(err=>{
                reject(err);
            });
        });
    }

    constructor() {
        // passport.use(new CookieStrategy(
        //      (token : string, done : any, test: any) =>{
        //     }
        // ));
        this.middleware = this.onRequestReceived;
        // this.middleware = passport.authenticate('cookie', { failureRedirect: '/login', session: false });
    }

    private static readonly ALLOW_UNCHAGNED_PWD=[
        { path:"/api/flows/current", method:["GET"]},
        { path:"/platform*", method:["GET"]},
        { path:"/api/members/.*/change_password", method:["GET","POST"]},
        { path:"/api/tokens/me/*", method:["GET"]},
        { path:"/api/flows-linklogic/current", method:["GET"]},
        { path:"/api/users*", method:["GET"]},
        { path:"/api/bots*", method:["GET"]},
    ];
    private mustChangePassword(req : any): boolean{
        const allowUnchangedPwd = Authenticator.ALLOW_UNCHAGNED_PWD;
        let idx = allowUnchangedPwd.findIndex(e => (req.path.match(e.path) && (e.method.some(r=>req.method.includes(r)) || e.method.length == 0 )));
        return idx <= -1;
    }

    onRequestReceived = (req: any, res: any, next: any) => {
        const token = req.cookies.token;

        this.decryptToken(token).then((json: TokenResponseJson) => {
            const permission = Authenticator.ROLES_PERMISSION;
            const index = permission.findIndex(e => (req.path.match(e.path) && (e.method.some(r=>req.method.includes(r)) || e.method.length == 0 )));
            log.debug('[Request Path]: ' + req.path + ", permission: "+JSON.stringify(permission[index]));
            if(json.must_change_password && this.mustChangePassword(req)){
                log.debug('[Forbidden] [Member: ' + json.member_id + '] ' + req.method + ' ' + req.url + " reason: must change password");
                if(req.headers['content-type'] && req.headers['content-type'].startsWith("application/json")){
                    res.status(403);
                    res.json({
                        error:'Unauthorized token'
                    });
                }
            }else{
                if(index > -1 ) {
                    if (permission[index].role.length == 0 && permission[index].method.length == 0 ) {
                        log.debug('[Accepted] [Member: ' + json.member_id + '] ' + req.method + ' ' + req.url);
                        next();
                    } else {
                        if ( (permission[index].role.length == 0 || permission[index].role.some(r => json.roles.includes(r))) && (permission[index].method.length == 0 || permission[index].method.some(r => req.method.includes(r))) ) { //json.roles == permission.role
                            log.debug('[Accepted] [Member: ' + json.member_id + '] ' + req.method + ' ' + req.url);
                            next();
                        } else {
                            log.debug('[Forbidden] [Member: ' + json.member_id + '] ' + req.method + ' ' + req.url + " reason: no permission");
                            if(req.headers['content-type'] && req.headers['content-type'].startsWith("application/json")){
                                res.status(403);
                                res.json({
                                    error:'Unauthorized token'
                                });
                            }
                            else{
                                res.redirect('/platform');
                            }
                        }
                    }
                }
                else{
                    log.debug('[Accepted] [Member: ' + json.member_id + '] ' + req.method + ' ' + req.url);
                    next();
                }
            }
        }).catch((err: any) => {
            log.error('[Denied]: ' + req.method + ' ' + req.url+" reason: "+err);
            if(req.headers['content-type'] && req.headers['content-type'].startsWith("application/json")){
                res.status(401);
                res.json({
                    error:'Invalid token'
                });
            }
            else{
                res.redirect('/login');
            }
        });
    };
    public issueNewToken(memberId: string, password: string, res:any, isSAML : boolean) : Promise<string>{
        return ApiProxy.getInstance().sendRequest('POST', '/members/'+memberId+'/tokens',{
            password:password
        }).then((json)=>{
            if(json.token && res){
                log.info('[Authenticate] Member id ' + memberId + ' successfully authenticated');
                let cookieOption: any = {httpOnly: true};
                if(process.env.NODE_ENV === 'production') cookieOption.secure = true;
                res.cookie('token', json.token, cookieOption);
                res.cookie('is_saml', isSAML);
            }
            return json.token;
        }).catch((err: any) => {
            if (err.response) {
            }
            let reason: string = 'Unable to connect to API Service';
            let statusCode = 500;
            let body = {};
            if (err.response) {
                reason = err.response.statusCode + ': ' + (err.response.body ? err.response.body.message : '');
                statusCode = err.response.statusCode;
                body = err.response.body;
            }
            log.error('[Authenticate] Error authenticating member id ' + memberId + ' reason: ' + reason);
            res.status(statusCode);
            res.json(body);
        });
    }
    // private getLogString(req : any, json: TokenResponseJson){
    //     const acceptDeny = json? "Accepted" : "Denied";
    //     const
    //     if(json){
    //
    //     }
    //     else return 'Denied '
    // }
}