import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';

export class ChannelManager {
    public static async getUserInfo(psid: string, token: string) {
        Log.debug('[ChannelManager] Getting user info from facebook with psid: ' + psid);
        try {
            let resultUserInfo = await ApiProxy.getInstance().sendRequest("GET", `/channels/loadUserInfo?psid=${psid}&token=${token}`);

            Log.debug('Result get user info from facebook with psid ' + psid + ' is:', resultUserInfo);
            return Promise.resolve(resultUserInfo);
        }
        catch (err) {
            Log.error('[ChannelManager] Error while getting sales channels details: ', err);
            return Promise.reject(err);
        }
    }
}