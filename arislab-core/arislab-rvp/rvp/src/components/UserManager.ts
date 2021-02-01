import Auth from "./Auth";
import { Log } from '../utils/Log';
import { ApiProxy } from './ApiProxy';

export interface UserInfo { email: string, fullName: string, user_id: string }
//work around (can't put status in UserInfo interface)
export interface UserStatus { isVerified: boolean }
export class UserManager {
    private static tokenUserMap: { [key: string]: UserInfo } = {};

    public static getTokenInfo(token: string): UserInfo {
        return this.tokenUserMap[token];
    }

    public static registerTokenInfo(token: string, info: UserInfo) {
        this.tokenUserMap[token] = info;
    }

    public static async getUserVerifyStatus(token: string) {
        if (this.tokenUserMap[token]) {
            const id = this.tokenUserMap[token].user_id;
            if (id) {
                const result = await ApiProxy.getInstance().sendRequest("GET", `/businessProfile/findByAuth0ID?auth0ID=${id}`);
                return result[0].verifyInfo.isVerified
            }
        }
    }
}