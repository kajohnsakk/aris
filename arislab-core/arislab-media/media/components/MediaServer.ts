import {EventManager} from "../EventManager";
import {Log} from "../utils/Log";
import {Event} from "../models/Event";
// const { NodeMediaCluster } = require('node-media-server');
const NodeMediaCluster = require('node-media-server');

export class MediaServer{
    private nms : any;
    constructor(){
        const numCPUs = require('os').cpus().length;
        const config = {
            // logType: 5,
            rtmp: {
                host: '127.0.0.1',
                port: 1935,
                chunk_size: 60000,
                gop_cache: true,
                ping: 60,
                ping_timeout: 30
            },
            http: {
                host: '127.0.0.1',
                port: 8000,
                allow_origin: '*'
            },
            // https: {
            //     port: 8443,
            //     key:'/home/ubuntu/arislab/privatekey.pem',
            //     cert:'/home/ubuntu/arislab/certificate.pem',
            // },
            cluster: {
                num: numCPUs
            }
        };
        this.nms = new NodeMediaCluster(config);
        this.nms.on('preConnect', (id:string, args:any) => {
            console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
            // let session = nms.getSession(id);
            // session.reject();
        });

        this.nms.on('postConnect', (id:string, args:any) => {
            console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
        });

        this.nms.on('doneConnect', (id:string, args:any) => {
            console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
        });

        this.nms.on('prePublish', (id:string, StreamPath:string, args:any) => {
            console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            // let session = nms.getSession(id);
            // session.reject();
        });

        this.nms.on('postPublish', (id:string, StreamPath:string, args:any) => {
            const eventCode = StreamPath.replace("/live/",'');
            Log.debug("Publish event with event code "+eventCode);
            Event.getEventByCode(eventCode).then(event=>{
                // return event.startBroadcast(event.toJSON().facebookStreamKey);
				// return event.startBroadcast(event.toJSON().facebookData.streamKey);
                return event.startBroadcast(this.nms.getSession(id));
            });
        });

        this.nms.on('donePublish', (id:string, StreamPath:string, args:any) => {
            console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
        });

        this.nms.on('prePlay', (id:string, StreamPath:string, args:any) => {
            console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            // let session = nms.getSession(id);
            // session.reject();
        });

        this.nms.on('postPlay', (id:string, StreamPath:string, args:any) => {
            console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
        });

        this.nms.on('donePlay', (id:string, StreamPath:string, args:any) => {
            console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
        });
    }
    start(){
        this.nms.run();
    }
}