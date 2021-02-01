import { ExternalProxy } from '../modules/ExternalProxy';
import { Log } from '../utils/Log';

export interface IAuth0TokenRequestBody {
    grant_type: string,
    client_id: string,
    client_secret: string,
    code: string,
    redirect_uri: string
}

export class AuthenticatorUtility {
    // public static async getAuth0Token(body: IAuth0TokenRequestBody) {
    public static async getAuth0Token(code: string) {
        try {
            const resultAuth0Token = await ExternalProxy.getInstance().sendRequest({
                method: "POST",
                uri: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
                body: {
                    grant_type: 'authorization_code',
                    client_id: process.env.AUTH0_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    code: code,
                    redirect_uri: process.env.WEB_URL
                }
            });
            return Promise.resolve(resultAuth0Token);
        } catch (error) {
            Log.error('Error while getting auth0 token: ', error);
            return Promise.reject(error);
        }
    }

    public static async getAuth0UserInfo(access_token: string) {
        try {
            const resultAuth0UserInfo = await ExternalProxy.getInstance().sendRequest({
                method: "GET",
                uri: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            return Promise.resolve(resultAuth0UserInfo);
        } catch (error) {
            Log.error('Error while getting userinfo from auth0: ', error);
            return Promise.reject(error);
        }
    }
}