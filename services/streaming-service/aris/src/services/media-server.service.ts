const NodeMediaServer = require("node-media-server");
const exec = require("child_process").exec;
import config from "../config/config";

class MediaServer {
  liveChannel: any;
  constructor() {
    this.liveChannel = this.init();

    this.liveChannel.on("preConnect", (id: string, args: any) => {
      console.log(
        "[NodeEvent on preConnect]",
        `id=${id} args=${JSON.stringify(args)}`
      );
    });

    this.liveChannel.on("postConnect", (id: any, args: any) => {
      console.log(
        "[NodeEvent on postConnect]",
        `id=${id} args=${JSON.stringify(args)}`
      );
    });

    this.liveChannel.on("doneConnect", (id: any, args: any) => {
      console.log(
        "[NodeEvent on doneConnect]",
        `id=${id} args=${JSON.stringify(args)}`
      );
    });

    this.liveChannel.on("prePublish", (id: any, StreamPath: any, args: any) => {
      console.log(
        "[NodeEvent on prePublish]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
      );
      // let session = this.liveChannel.getSession(id);
      // session.reject();
    });
    const source = `rtmp://localhost:1935/live/test`;
    const url = `rtmps://live-api-s.facebook.com:443/rtmp/114055417178154?s_bl=1&s_hv=0&s_psm=1&s_sc=114055433844819&s_sw=0&s_vt=api-s&a=Abz1N4Byy2yCZzKy`;

    this.liveChannel.on(
      "postPublish",
      (id: any, StreamPath: any, args: any) => {
        const ffmpeg = `/usr/local/bin/ffmpeg -i "${source}" -i "https://sv1.picz.in.th/images/2020/11/11/bshhJb.png" -filter_complex "[0:v][1:v] overlay=25:25:enable='between(t,0,20)'" -pix_fmt yuv420p -c:a copy -acodec libmp3lame -tune zerolatency -ar 44100 -b:a 128k -profile:v baseline -s 1280x720 -bufsize 6000k -vb 400k -maxrate 1500k -deinterlace -vcodec libx264 -preset veryfast -g 30 -r 30 -f flv "${url}"`;
        const ffmpeg1 = `/usr/local/bin/ffmpeg -i "${source}" -i "https://ffmpeg.org/pipermail/ffmpeg-user/2015-January/025052.html" -filter_complex "[0]yadif[m];[m][1]overlay=25:25,realtime" -af arealtime -s 1280x720 -vcodec libx264 -pix_fmt yuv420p -preset fast -r 30 -g 60 -b:v 2000k \
        -acodec libmp3lame -ar 44100 -threads 6 -tune zerolatency -qscale 3 -b:a 712000 -bufsize 512k -f flv "${url}"`;
        var coffeeProcess = exec(ffmpeg1);

        coffeeProcess.stdout.on("data", function (data: any) {
          console.log("MediaServer -> coffeeProcess.stdout.on -> data", data);
        });

        coffeeProcess.stdout.on("error", function (err: any) {
          console.log("MediaServer -> coffeeProcess.stdout.on -> err", err);
        });

        console.log(
          "[NodeEvent on postPublish]",
          `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
        );
      }
    );

    this.liveChannel.on(
      "donePublish",
      (id: any, StreamPath: any, args: any) => {
        console.log(
          "[NodeEvent on donePublish]",
          `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
        );
      }
    );

    this.liveChannel.on("prePlay", (id: any, StreamPath: any, args: any) => {
      console.log(
        "[NodeEvent on prePlay]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
      );
      // let session = this.liveChannel.getSession(id);
      // session.reject();
    });

    this.liveChannel.on("postPlay", (id: any, StreamPath: any, args: any) => {
      console.log(
        "[NodeEvent on postPlay]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
      );
    });

    this.liveChannel.on("donePlay", (id: any, StreamPath: any, args: any) => {
      console.log(
        "[NodeEvent on donePlay]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
      );
    });
  }

  init() {
    if (this.liveChannel) {
      return this.liveChannel;
    }
    return new NodeMediaServer(config.mediaServer);
  }

  start() {
    this.liveChannel.run();
  }
}

export default new MediaServer();
