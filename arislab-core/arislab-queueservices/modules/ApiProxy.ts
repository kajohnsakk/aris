import * as requestPromise from "request-promise-native";
import { Log } from "../utils/Log";
import Axios from "axios";
var FormData = require("form-data");
export class ApiProxy {
  private static mProxy = new ApiProxy();
  static getInstance(): ApiProxy {
    return ApiProxy.mProxy;
  }

  public apiserverEndpoint: string = `http://${process.env.API_HOST}:${process.env.API_PORT}/api`;

  public getFileUploadEndpoint() {
    return this.apiserverEndpoint + "/files";
  }

  public getFilePathUploadEndpoint() {
    return this.apiserverEndpoint + "/files/path";
  }

  public uploadFile(
    file: any,
    uploadProgressCallback: (progress: number) => void
  ) {
    let data = new FormData();
    data.append("file", file);

    return Axios.post(this.getFileUploadEndpoint(), data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      onUploadProgress: (progressEvent) => {
        uploadProgressCallback(
          Math.min(
            99,
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          )
        );
      },
    }).then((response) => {
      return response.data.link as string;
    });
  }

  public uploadFileFromPath(
    directory: string,
    filePath: string,
    mimeType: string
  ) {
    let data = {
      directory: directory,
      filePath: filePath,
      mimeType: mimeType,
    };

    return Axios.post(this.getFilePathUploadEndpoint(), data).then(
      (response) => {
        return response.data.link as string;
      }
    );
  }

  public sendRequest(method: string, path: string, json?: any) {
    return requestPromise({
      method: method,
      uri: this.apiserverEndpoint + path,
      json: true,
      body: json || undefined,
    })
      .then((result: any) => {
        return result;
      })
      .catch((err: Error) => {
        Log.error("error while requesting api server " + err);
        throw err;
      });
  }
}
