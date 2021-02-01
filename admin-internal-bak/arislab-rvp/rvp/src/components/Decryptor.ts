/**
 * Created by touchaponk on 16/07/2017.
 */
import * as passport from 'passport';
import {Handler} from 'express';
import {ApiProxy} from './ApiProxy';

const log = require('../../utils/log');
import * as rp from 'request-promise-native';
import {IncomingMessage} from 'http';
const ursa = require('ursa');
const fs = require('fs');
export class Decryptor {

    private static mDecryptor: Decryptor = new Decryptor();
    public static getInstance(): Decryptor {
        return this.mDecryptor;
    }

    public readonly middleware: Handler;
    private privateKey : any = null;
    public decryptRequest(req:any): Promise<void> {
        return Promise.resolve().then(()=>{
            if(req.body && req.body.enc){
                if(this.privateKey){
                    req.body = JSON.parse(this.privateKey.decrypt(req.body.enc, 'base64', 'utf8'));
                    log.debug('request body decrypted as ',req.body);
                }
                else{
                    log.error('unable to decrypt '+req.body.enc+" since private key is not configured");
                    throw new Error('Private key not configured');
                }
            }
        });
    }

    constructor() {
        // passport.use(new CookieStrategy(
        //      (token : string, done : any, test: any) =>{
        //     }
        // ));
        this.middleware = this.onRequestReceived;
        if(process.env.PRIVATE_KEY){
            const pk = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
            this.privateKey = ursa.createPrivateKey(pk);
        }
        // this.middleware = passport.authenticate('cookie', { failureRedirect: '/login', session: false });
    }

    onRequestReceived = (req: any, res: any, next: any) => {
        this.decryptRequest(req).then(()=>{
            next();
        });
    };
    // private getLogString(req : any, json: TokenResponseJson){
    //     const acceptDeny = json? "Accepted" : "Denied";
    //     const
    //     if(json){
    //
    //     }
    //     else return 'Denied '
    // }
}