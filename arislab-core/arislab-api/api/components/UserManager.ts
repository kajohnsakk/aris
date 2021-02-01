import Auth from "./Auth";

export interface UserInfo { email: string, instances: string[] }
export class UserManager {
    private static tokenUserMap: { [key: string]: UserInfo } = {};

    public static getTokenInfo(token: string): UserInfo {
        return this.tokenUserMap[token];
    }

    public static registerTokenInfo(token: string, info: UserInfo) {
        this.tokenUserMap[token] = info;
    }

    public static getUsersWithInstance(instance: string) {
        return Auth.getInstance().getUsersInfo().then(infos => {
            return infos.filter(info => {
                return info.instances.indexOf(instance) >= 0 || info.instances.indexOf('_all') >= 0
            });
        })
    }
}