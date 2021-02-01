import {ChildProcess} from "child_process";
import {Log} from "./utils/Log";

const exec = require('child-process-promise').exec;
export class EventManager{
    private static mManager : EventManager = new EventManager();
    public static getInstance() : EventManager{
        return this.mManager;
    }
    private ffmpegProcesses : {[key: string] : ChildProcess} = {};
    constructor(){

    }
    public startBroadcast(appId: string, facebookId: string){
        const processId = appId+'___'+facebookId;
        if(this.ffmpegProcesses[processId])
            this.stopBroadcast(processId);
        Log.debug("Starting relay with id: "+processId);
        const sourceRtmpUrl = `rtmp://localhost/live/${appId}`;
        const facebookRtmpUrl = `rtmp://live-api-s.facebook.com:80/rtmp/${facebookId}`;
        const ffmpegCmd = "ffmpeg -i \""+sourceRtmpUrl+"\" -vcodec libx264 -f flv \""+facebookRtmpUrl+"\"";
        Log.debug("Executing command: "+ffmpegCmd);
        const promise = exec(ffmpegCmd, []);

        const childProcess : ChildProcess = promise.childProcess;

        Log.debug('FFmpeg process started with childProcess: ' + childProcess.pid);
        // childProcess.stdout.on('data', (data : any) => {
        //     Log.debug('[spawn] stdout: ', data.toString());
        // });
        childProcess.stderr.on('data', (data : any) => {
            Log.debug('[spawn] stderr: ', data.toString());
        });

        promise.then(function () {
            Log.debug('Process '+processId+" completed");
        })
            .catch((err : any) => {
                Log.error('Process: '+processId+" error:"+ err);
            });
    }
    public stopBroadcast(relayId: string){
        Log.debug("Stopping relay with id: "+relayId);
        const proc = this.ffmpegProcesses[relayId];
        delete this.ffmpegProcesses[relayId];
        proc.kill('SIGINT');
    }

}