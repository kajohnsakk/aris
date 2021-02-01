import * as express from 'express'
import {Express} from "express";
import {Log} from "../utils/Log";
const axios = require('axios');

export class StreamStatusServer{
    private app : Express;
    constructor(){
        this.app = express();
        
        this.app.get('/stream/:liveCode', (req: any, res: any) => {
            let liveCode = req.params.liveCode;
            let timer: any;
            let foundStream: boolean = false;
            const webRes = res;
            const intervalTime = 5;
        
            if( liveCode.length > 0 ) {
        
                webRes.writeHead(200, {
                    "Connection": "keep-alive",
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Access-Control-Allow-Origin": "*"
                });
        
                webRes.write("\n\n");
        
                timer = setInterval(() => {
                    
                    axios.get('http://localhost:8000/api/streams').then( (response: any) => {
                        // handle success
                        console.log( JSON.stringify(response.data) );
                        if( response.data.hasOwnProperty('live') ) {
                            if( response.data.live.hasOwnProperty(liveCode) ) {
                                if( !foundStream ) foundStream = true;
                                webRes.write( `data: ${JSON.stringify(response.data.live[liveCode])}` );
                            } else {
                                if( foundStream ) {
                                    webRes.write( `data: ${JSON.stringify({ status: 'Error', statueDetail: 'Live end.' })}` + "\n" );
                                } else {
                                    webRes.write( `data: ${JSON.stringify({ status: 'Wait', statueDetail: 'Wait for Live connect.' })}` + "\n" );
                                }
                            }
                        } else {
                            webRes.write( `data: ${JSON.stringify({ status: 'Null', statueDetail: 'No Live is streaming.' })}` + "\n" );
                        }
        
                        webRes.write("\n\n");
                    })
                    .catch( (error: any) => {
                        // handle error
                        console.log(error);
                        webRes.end();
                    });
        
                }, intervalTime * 1000 );
        
                req.on('close', () => {
                    clearInterval(timer);
                    //webRes.writeHead(404);
                    //webRes.end();
                });
        
            } else {
        
                webRes.writeHead(404);
                webRes.end();
        
            }
        
        });
    }
    start(){
        const server = this.app.listen(process.env.STREAM_STATUS_PORT || 1112, function () {
            Log.debug('Stream Status Server Listening at http://%s:%s', server.address());
            // Log.debug('Web server starting with env ', process.env)
        });
    }
}