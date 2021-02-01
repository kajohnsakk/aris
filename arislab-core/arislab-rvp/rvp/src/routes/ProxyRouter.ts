import {Log} from "../utils/Log";

const express = require('express');
const router = express.Router();
import {FileTypeResult} from "file-type";
const log = require("../../utils/log");
import * as requestPromise from "request-promise-native";

router.post('/', (req: any, res: any) => {
    const requestOption = req.body;
    return requestPromise(requestOption).then((result) => {
        res.json(result);
    }).catch((err) => {
        log.error("error while requesting external server options ", requestOption, " with error " + err);
        res.status((err.response) ? err.response.statusCode : 500);
        res.json((err.response) ? err.response.body : {});
    });
});
router.get('/analyze', (req: any, res: any) => {
    const uri = req.query.uri;
    Proxy.analyzeMimeTypeWithUrl(uri).then((result)=>{
        res.json(result);
    }).catch((err) => {
        log.error("error while analyzing mimetype of uri ", uri, " with error " + err);
        res.status((err.response) ? err.response.statusCode : 500);
        res.json((err.response) ? err.response.body : {});
    });
});
export class Proxy{
    /**
     * Analyze file type of a given url. Will return null if URL is invalid
     */
    public static analyzeMimeTypeWithUrl(url: string): Promise<FileTypeResult | null> {
        return new Promise(resolve => {

            requestPromise( {
                method: 'HEAD',
                uri: url,
                json: true
            }).then((result)=>{
                Log.debug('contentType for ' + url + ' = ' + result['content-type']);
                resolve({
                    mime: result['content-type'],
                    ext: ''
                })
            }).catch((err)=>{
                Log.error('error while requesting to get mimetype of uri ', url, ' with ', err);
                resolve({
                    mime: '',
                    ext: ''
                });
            });

        });
    }
}

module.exports = router;