import { ApiService } from './ApiService';
import { ExternalProxy } from './ExternalProxy';

declare var FB: any;

export interface FacebookAuthResponseJson {
    authResponse: { accessToken: string, userID: string }
}
export interface FacebookPageJson {
    id: string,
    access_token: string,
    name: string,
    category: string,
    category_list: {
        id: string,
        name: string 
    }[],
    perms: string[],
    profilePicture: string
}

export class FacebookService {
    private static readonly FACEBOOK_SCOPES = 'manage_pages,pages_messaging,read_page_mailboxes,publish_pages';
    private static mService = new FacebookService();

    public static getInstance() {
        return this.mService;
    }

    private authenticating = false;
    private authJson!: FacebookAuthResponseJson;
    public pages: FacebookPageJson[] = [];
    private constructor() {
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: process.env.REACT_APP_PLATFORM_FACEBOOK_APP_ID || '502170539988549',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v2.12'
            });
        };

        (function (d, s, id) {
            var js: any, fjs: any = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    public getToken() {
        if (!this.authJson || !this.authJson.authResponse) return null;
        return this.authJson.authResponse.accessToken;
    }
    public getUserId() {
        if (!this.authJson || !this.authJson.authResponse) return null;
        return this.authJson.authResponse.userID;
    }
    public loadPages(): Promise<FacebookPageJson[]> {
        return Promise.resolve().then(() => {
            if (!this.getToken()) {
                throw new Error('Invalid token while trying to load facebook pages');
            }
            else {
                return ApiService.getInstance().sendRequest('GET',
                    '/channels/facebook/pages?token=' + this.getToken() + '&userId=' + this.getUserId()
                )
            }
        }).then((data: FacebookPageJson[]) => {
            this.pages = data;
            // console.log("facebookservice.ts pages ",this.pages);
            this.pages.map(async (page: any) => {
                page['profilePicture'] = await this.getPageProfilePicture(page.id, page.access_token);
                return page;
            });
            return this.pages;
        }).catch((err) => {
            console.error("Error while connecting with Facebook " + err);
            // bootbox.alert("Error while connecting to Facebook: " + err);
            return [];
        })
    }
    
    public getPageProfilePicture(pageId: string, accessToken: string) {
        return ExternalProxy.getInstance().sendRequest({
            uri: `https://graph.facebook.com/v2.12/${pageId}/picture?redirect=0&height=250&width=250&access_token=${accessToken}`,
            method: 'get'
        })
        .then((resultGetPageProfilePicture: any) => {
            return Promise.resolve(resultGetPageProfilePicture['data']['url']);
        })
        .catch((error: any) => {
            console.log('Error while getting profile picture ', error);
            return Promise.reject(error);
        })
    }

    // Process json from Facebook and return true if the login was successful, false otherwise
    private onFacebookLoginResponded(response: FacebookAuthResponseJson) {
        this.authenticating = false;
        if (response.authResponse) {
            this.authJson = response;
            return true;
        } else {
            console.log('User cancelled login or did not fully authorize.');
            return false;
        }
    };

    public authenticate() {
        return new Promise((resolve) => {
            if (this.authenticating) {
                return;
            }
            this.authenticating = true;
            FB.login((resp: FacebookAuthResponseJson) => {
                this.onFacebookLoginResponded(resp);
                resolve();
            }, { scope: FacebookService.FACEBOOK_SCOPES }
            );
        });
    }
}