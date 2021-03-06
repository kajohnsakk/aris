import Auth from "./Auth";
import { Log } from '../utils/Log';

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
            return id;
        }
    }

    // private setCookie(res: any, cookieObj: cookieObj[], set_to_main_domain?: boolean) {
    //     let cookieOption: any = {
    //         httpOnly: false,
    //         secure: true
    //     };

    //     if (set_to_main_domain) {
    //         // Set cookie to current domain, then set it again for ".arislab.ai"
    //         this.setCookie(res, cookieObj);
    //         cookieOption['domain'] = ".arislab.ai";
    //     }

    //     return cookieObj.forEach((cookie) => {
    //         res.cookie(cookie['cookieName'], cookie['cookieValue'], cookieOption)
    //     });
    // }
}