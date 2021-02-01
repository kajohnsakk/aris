const requestPromise = require('request-promise-native');
import { Log } from '../ts-utils/Log';

export interface ExternalRequestOption {
    method: string,
    uri: string,
    json?: boolean,
    headers?: any,
    body?: any,
    auth?: { user: string, pass: string },
    resolveWithFullResponse?: boolean
};
export class ExternalProxy {
    private static mProxy = new ExternalProxy();

    static getInstance(): ExternalProxy {
        return ExternalProxy.mProxy;
    }
    private proxyUrl: string;
    private constructor() {
        if (process.env.PROXY_HOST) {
            this.proxyUrl = "http://" + process.env.PROXY_HOST + ":" + process.env.PROXY_PORT + "/proxy";
        }
    }
    public sendRequest(requestOption: ExternalRequestOption) {
        if (requestOption.json === undefined || requestOption.json === null)
            requestOption.json = true;

        if (this.proxyUrl) {
            requestOption = {
                method: "POST",
                uri: this.proxyUrl,
                json: true,
                body: requestOption
            }
        }

        return requestPromise(requestOption).then((res: any) => {
            return res;
        }).catch((err: Error) => {
            Log.error("error while requesting external server " + err);
            throw (err);
        });
    }
};