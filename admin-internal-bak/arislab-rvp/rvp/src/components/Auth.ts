import * as requestPromise from "request-promise-native";
import { UserInfo } from "./UserManager";

export default class Auth {

    private static readonly DOMAIN: string = process.env.AUTH0_DOMAIN || 'arislab.auth0.com';
    private static readonly CLIENT_ID: string = process.env.AUTH0_CLIENT_ID || '6XmLzLa5uAUb44VQeALbBcOyFlHZf3CN';
    private static readonly CLIENT_SECRET: string = process.env.AUTH0_CLIENT_SECRET || 'ADW2KScxB32-WbEkF5TpTtfU7qP4XEGl7qdi7gbsLD6JaCCQEQwY7kfD09v7VxG-QZoDcjL-CLdf';
    private static mAuth: Auth;
    public static getInstance() {
        if (!Auth.mAuth) Auth.mAuth = new Auth();
        return Auth.mAuth;
    }
    private token: string;
    public constructor() {
        this.renewToken();
        setInterval(() => { this.renewToken() }, 1000 * 3600 * 24 * 3);
    }
    private renewToken() {
        const options = {
            method: 'POST',
            uri: 'https://' + Auth.DOMAIN + '/oauth/token',
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: {
                "grant_type": "client_credentials",
                "client_id": Auth.CLIENT_ID,
                "client_secret": Auth.CLIENT_SECRET,
                "audience": "https://" + Auth.DOMAIN + "/api/v2/"
            },
            json: true
        };

        return requestPromise(options).then((res: { access_token: string }) => {
            this.token = res.access_token;
            return this.token;
        });

    }
    // public getUsersInfo(): Promise<UserInfo[]> {
    //     return Promise.resolve().then(() => {
    //         if (this.token) return this.token;
    //         else return this.renewToken();
    //     }).then(token => {
    //         const opts = {
    //             method: 'GET',
    //             headers: {
    //                 'cache-control': 'no-cache',
    //                 Authorization: `Bearer ${token}`
    //             },
    //             url: 'https://' + Auth.DOMAIN + '/api/v2/users',
    //             json: true
    //         };
    //         return requestPromise(opts).then((userJson: { email: string, app_metadata: { instances: string[] } }[]) => {
    //             return userJson.map(info => {
    //                 return {
    //                     email: info.email, instances: info.app_metadata.instances
    //                 }
    //             })
    //         });
    //     })
    // }
}