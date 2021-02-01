/**
 * Created by touchaponk on 16/07/2017.
 */

import * as rp from "request-promise-native";

const log  = require("../../utils/log");

const apiEndpoint = "http://"+(process.env.API_HOST || "localhost")+":"+(process.env.API_PORT || 1780) +"/api";
export class ApiProxy{
    private static readonly mProxy = new ApiProxy();
    public static getInstance() : ApiProxy{
        return this.mProxy;
    }
    constructor(){

    }
    getRequestOptionWithPath(path: string) : string{
        return apiEndpoint+path;
    }
    public sendRequest(method: string, path: string, json?: any) {
        return rp({
            method: method,
            uri: apiEndpoint + path,
            json: true,
            body: json
        }).then((result) => {
            return result;
        }).catch( (err) => {
            log.error("error while requesting api server " + err);
            throw (err);
        });
    }
}