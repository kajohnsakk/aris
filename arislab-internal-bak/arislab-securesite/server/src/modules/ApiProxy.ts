/**
 * Created by touchaponk on 133//17.
 */
import * as requestPromise from "request-promise-native";
import {Log} from '../utils/Log';
export class ApiProxy{
    private static mProxy = new ApiProxy();
    static getInstance() : ApiProxy{
        return ApiProxy.mProxy;
    }

    public apiserverEndpoint : string = "http://"+(process.env.API_HOST || "localhost")+":"+(process.env.API_PORT || 1780)+"/api";
    public sendRequest(method: string, path: string, json?: any) {
        return requestPromise({
            method: method,
            uri: this.apiserverEndpoint + path,
            json: true,
            body: json || undefined
        }).then((result : any) => {
            return result;
        }).catch( (err : Error) => {
            Log.error("error while requesting api server " + err);
            throw (err);
        });
    }

}