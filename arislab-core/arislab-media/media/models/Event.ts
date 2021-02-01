import { ElasticsearchClient } from "../components/ElasticsearchClient";
import { Product } from "./Product";
import { AbstractPersistentModel } from "./AbstractPersistentModel";
import { EventTransaction, IEventTransaction } from "./EventTransaction";
import { Log } from "../utils/Log";
import { ChildProcess } from "child_process";
import * as path from "path";

var cp = require("child_process");
const puppeteer = require("puppeteer");
const fs = require("fs");
const os = require("os");
const ifaces = os.networkInterfaces();
const localIP = getLocalIP();
const timeUuid = require("time-uuid");

const exec = require("child-process-promise").exec;

const STREAM_ERROR_LIST = ["speed=N/A", "overread", "Operation not permitted"];
var EVENT_TRANSACTION_ID: string;

export function getLocalIP() {
  let localIP;
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface: any) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        // console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        localIP = iface.address;
      }

      ++alias;
    });
  });

  return localIP;
}

export interface EventFacebookJson {
  videoID: string;
  streamURL: string;
  streamKey: string;
}

export interface EventJson {
  storeID: string;
  name: string;
  code: string;
  description: string;
  videoOrientation: string;
  createAt: number;
  eventStartAt?: number;
  eventEndAt?: number;
  streamingToIpAddress?: string;
  facebookData: EventFacebookJson;
  products: string[];
}

export class Event extends AbstractPersistentModel {
  public storeLogo: string;
  public selectedProduct: Product;
  public products: Product[];
  private readonly json: EventJson;
  private ffmpegProcess: ChildProcess;
  private eventTransaction: EventTransaction;
  private streamingDetail: string = "";

  constructor(json: EventJson, eventId: string) {
    super(eventId);
    this.json = json;
  }

  private loadProducts() {
    return Product.findProductByIds(this.json.products).then((products) => {
      let sortedProducts: Product[] = [];
      this.json.products.forEach((productID) => {
        products.forEach((productData) => {
          if (productData.productID === productID) {
            sortedProducts.push(productData);
          }
        });
      });
      this.products = sortedProducts;
    });
  }

  public loadSelectedProduct(selectedID?: string) {
    return Product.getProductById(selectedID).then((product) => {
      this.selectedProduct = product;
    });
  }

  private loadStoreLogo() {
    return ElasticsearchClient.getInstance()
      .search("store", {
        query: {
          match: {
            "storeID.keyword": this.json.storeID,
          },
        },
      })
      .then((result) => {
        let logo =
          "https://www.labaleine.fr/sites/baleine/files/image-not-found.jpg";
        if (result.length > 1) {
          Log.error(
            "Error: More than 1 store containing id " +
              this.json.storeID +
              " (stores: ",
            result,
            ");"
          );
        } else if (result.length == 0) {
          Log.error("Store id: " + this.json.storeID + " not found");
        } else {
          let store = result[0]._source;
          if (store.hasOwnProperty("storeInfo")) {
            if (store.storeInfo.hasOwnProperty("businessProfile")) {
              if (store.storeInfo.businessProfile.hasOwnProperty("logo")) {
                logo = store.storeInfo.businessProfile.logo;
              }
            }
          }
        }

        this.storeLogo = logo;
      });
  }

  public static getEventById(
    eventId: string,
    selectedID?: string
  ): Promise<Event> {
    let event: Event;
    return ElasticsearchClient.getInstance()
      .get("event", eventId)
      .then((eventJson) => {
        event = new Event(eventJson, eventId);
        return event.loadProducts();
      })
      .then(() => {
        return event.loadStoreLogo();
      })
      .then(() => {
        if (selectedID) {
          return event.loadSelectedProduct(selectedID);
        }
      })
      .then(() => {
        return event;
      });
  }

  public static getEventByCode(code: string): Promise<Event> {
    let event: Event;
    return ElasticsearchClient.getInstance()
      .search("event", {
        query: {
          match: {
            "code.keyword": code,
          },
        },
      })
      .then((result) => {
        if (result.length > 1) {
          Log.error(
            "Error: More than 1 event containing event code " +
              code +
              " (events: ",
            result,
            ");"
          );
          return Promise.reject(new Error(""));
        } else if (result.length == 0) {
          Log.error("Event code: " + code + " not found");
          return Promise.reject(new Error(""));
        }
        event = new Event(result[0]._source, result[0]._id);
        return event.loadProducts();
      })
      .then(() => {
        return event;
      });
  }

  doUpdate(json: any): boolean {
    return false;
  }

  protected getType(): string {
    return "event";
  }

  toJSON(): any {
    return this.json;
  }

  public checkDirectorySync(directory: string) {
    try {
      fs.statSync(directory);
    } catch (e) {
      fs.mkdirSync(directory);
    }
  }

  public async updateScreenshot(activeProductId?: string) {
    try {
      const noProductUrl = `http://${
        process.env.MEDIA_WEB_HOST || "localhost"
      }:${process.env.WEB_PORT || 4080}/events/${
        this.id
      }/mask?activeProductId=undifind`;

      const fullUrl = `http://${process.env.MEDIA_WEB_HOST || "localhost"}:${
        process.env.WEB_PORT || 4080
      }/events/${this.id}/mask?activeProductId=${activeProductId}`;

      Log.debug("Taking screenshot from " + fullUrl);

      this.checkDirectorySync(process.cwd() + `/screenshot`);

      const path = process.cwd() + `/screenshot/${this.id}.png`;
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      let pageSize = { width: 720, height: 1280, isLandscape: false };
      if (this.json.videoOrientation === "HORIZONTAL") {
        pageSize = { width: 1280, height: 720, isLandscape: true };
      }

      const Page = await browser.newPage();
      await Page.setViewport({
        isMobile: true,
        height: pageSize.height,
        width: pageSize.width,
        isLandscape: pageSize.isLandscape,
      });

      Page.on("error", async (err: any) => {
        Log.error(
          "Failed to take screenshot from " + fullUrl + " with error: ",
          err
        );

        Log.debug("Try to taking screenshot from " + noProductUrl + " instead");
        await Page.goto(noProductUrl);
      });

      try {
        await Page.goto(fullUrl);
      } catch (err) {
        Log.error(
          "Error to take screenshot from " + fullUrl + " with error: ",
          err
        );

        Log.debug("Try to taking screenshot from " + noProductUrl + " instead");
        await Page.goto(noProductUrl);
      }

      const buffer = await Page.screenshot({
        path: path,
        omitBackground: true,
      });

      Log.debug("Screenshot of event " + this.id + " snapped to " + path);

      await Page.close();
      await browser.close();

      return { buffer, path };
    } catch (error) {
      Log.debug("Event -> updateScreenshot -> error", error);
    }
  }

  public async startBroadcast(
    connectedSession: any,
    facebookStreamKey: string = ""
  ) {
    if (this.ffmpegProcess) this.stopBroadcast();

    const screenshot = await this.updateScreenshot();
    Log.debug("Update start time of event id: " + this.id);
    await this.updateLiveTime("START");

    Log.debug("Starting broadcast with event: " + this.id);
    const sourceRtmpUrl = `rtmp://localhost/live/${this.json.code}`;

    let facebookRtmpUrl = "";
    if (facebookStreamKey.length > 0) {
      facebookRtmpUrl = `rtmp://live-api-s.facebook.com:80/rtmp/${facebookStreamKey}`;
    } else {
      facebookRtmpUrl = this.json.facebookData.streamURL;
    }

    let videoScale = "720x1280";
    if (this.json.videoOrientation === "HORIZONTAL") {
      videoScale = "1280x720";
    }

    const ffmpegCmd = `/usr/bin/ffmpeg -i "${sourceRtmpUrl}" -f image2 -stream_loop -1 -i "${
      screenshot.path
    }" \
        -filter_complex "[0:v][1:v]overlay=x=0:y=0,drawtext=fontfile=${path.join(
          __dirname,
          "../public/fonts/angsana_new.ttf"
        )}:text='',scale=${videoScale},format=yuv420p" \
        -c:v libx264 -pix_fmt yuv420p -profile:v baseline -level 3.1 -b:v 4M -bufsize 12M -r 30 -g 60 -preset ultrafast -crf 22 \
        -c:a aac -b:a 128k -ar 44100 \
        -metadata description="${EVENT_TRANSACTION_ID}" \
        -f flv -flvflags no_duration_filesize "${facebookRtmpUrl}"`;

    Log.debug("Executing command: " + ffmpegCmd);
    const promise = exec(ffmpegCmd, { maxBuffer: 102400 * 102400 });

    this.ffmpegProcess = promise.childProcess;

    Log.debug(
      "FFmpeg process started with childProcess: " + this.ffmpegProcess.pid
    );

    this.ffmpegProcess.stderr.on("data", (data: any) => {
      Log.debug("[Event ID: " + this.id + "] stderr: ", data.toString());

      if (STREAM_ERROR_LIST.length > 0) {
        for (let errorString of STREAM_ERROR_LIST) {
          if (data.toString().search(errorString) > -1) {
            this.streamingDetail = errorString;
            Log.error(
              "This stream [Event ID: " +
                this.id +
                '] has problem "' +
                errorString +
                '"'
            );
            this.ffmpegProcess.stderr.destroy();

            Log.debug(
              "Force broadcast of event " +
                this.id +
                " to stop by reject session."
            );
            connectedSession.reject();
            this.stopBroadcast();
            break;
          }
        }
      }
    });

    this.ffmpegProcess.stderr.on("close", () => {
      Log.debug("Broadcast of event " + this.id + " closed.");
      this.stopBroadcast();
    });

    promise
      .then(() => {
        Log.debug("Broadcast of event " + this.id + " completed.");
        this.stopBroadcast();
      })
      .catch((err: any) => {
        Log.error("Broadcast of event: " + this.id + " error: " + err);
        this.stopBroadcast();
      });
  }

  public async stopBroadcast() {
    try {
      Log.debug("Stopping broadcast of event id: " + this.id);
      const proc = this.ffmpegProcess;
      proc.kill("SIGINT");
      delete this.ffmpegProcess;

      Log.debug("Update end time of event id: " + this.id);
      await this.updateLiveTime("END");

      const path = process.cwd() + `/screenshot/${this.id}.png`;
      Log.debug("Remove image overlay {" + path + "} of event id: " + this.id);
      fs.unlinkSync(path);

      Log.debug("Kill of event id: " + this.id);
      cp.exec(
        'for pid in $(ps -aux | grep "ffmpeg" | awk \'/' +
          EVENT_TRANSACTION_ID +
          "/ {print $2}'); do kill -9 $pid; done",
        (err: any, stdout: any, stderr: any) => {
          if (err) {
            // node couldn't execute the command
            Log.error(
              "Can't kill unused process of event: " +
                this.id +
                " error: " +
                err
            );
            return;
          }

          // the *entire* stdout and stderr (buffered)
          Log.debug("Kill unused process of event: " + this.id);
          Log.debug(`stderr: ${stderr}`);
        }
      );
    } catch (error) {
      // Log.error('Error for stop broadcast with error: ' + error);
    }
  }

  public async updateLiveTime(type: string) {
    let updateJson = this.toJSON();
    if (type === "START") {
      updateJson.eventStartAt = Date.now();
      updateJson.streamingToIpAddress = localIP;

      await this.insertEventTransactionLive();
    } else if (type === "END") {
      updateJson.eventEndAt = Date.now();
      updateJson.streamingToIpAddress = "";

      await this.updateEventTransactionEnd();
    }
    return ElasticsearchClient.getInstance()
      .update(this.getType(), this.id, updateJson, true)
      .then(() => {
        return this;
      });
  }

  public findChannelByStoreID(storeID: string) {
    let searchQuery = {
      query: {
        match: {
          storeID: storeID,
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search("sales_channel", searchQuery)
      .then((resultFindStoreByID: any) => {
        if (resultFindStoreByID && resultFindStoreByID.length > 0) {
          return resultFindStoreByID.map((result: any) => {
            return result._source;
          });
        } else {
          return [];
        }
      })
      .catch((err: any) => {
        return err;
      });
  }

  public insertEventTransactionLive() {
    return new Promise((resolve, reject) => {
      let eventTransactionID: string = timeUuid();
      let eventTransactionObj: IEventTransaction = {
        eventTransactionID: eventTransactionID,
        eventID: this.id,
        storeID: this.json.storeID,
        code: this.json.code,
        streamingInfo: {
          name: this.json.name,
          description: this.json.description,
          videoID: this.json.facebookData.videoID,
          streamURL: this.json.facebookData.streamURL,
          status: "LIVE",
          detail: this.streamingDetail,
          eventStartAt: Date.now(),
          eventEndAt: 0,
          streamingToIpAddress: localIP,
          products: this.json.products,
        },
      };

      EVENT_TRANSACTION_ID = eventTransactionID;

      this.eventTransaction = new EventTransaction(
        eventTransactionObj,
        eventTransactionID
      );
      resolve(this.eventTransaction.update(eventTransactionObj));
    });
  }

  public updateEventTransactionEnd() {
    return new Promise((resolve, reject) => {
      let eventTransactionObj: IEventTransaction = this.eventTransaction.toJSON();
      eventTransactionObj["streamingInfo"]["status"] = "END";
      eventTransactionObj["streamingInfo"]["detail"] = this.streamingDetail;
      eventTransactionObj["streamingInfo"]["eventEndAt"] = Date.now();

      resolve(this.eventTransaction.updateJSON(eventTransactionObj));
    });
  }
}
