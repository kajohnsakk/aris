import axios from "axios";
const requestPromise = require("request-promise-native");
export class ApiService {
  public readonly apiserverEndpoint: string = window.location.origin + "/api";
  private static mProxy = new ApiService();

  static getInstance(): ApiService {
    return ApiService.mProxy;
  }

  public getFileUploadEndpoint() {
    return this.apiserverEndpoint + "/files";
  }

  public uploadFile(
    file: any,
    uploadProgressCallback: (progress: number) => void
  ) {
    const data = new FormData();
    data.append("file", file);

    return axios
      .post(this.getFileUploadEndpoint(), data, {
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
      })
      .then((response) => {
        return response.data.link as string;
      });
  }

  public sendRequest(
    method: string,
    path: string,
    json: any = {}
  ): Promise<any> {
    return requestPromise({
      method: method,
      uri: `${this.apiserverEndpoint}/${path}`,
      json: true,
      body: json,
      timeout: 3600,
    });
  }

  request(options: any) {
    const _options = {
      ...options,
      url: `${this.apiserverEndpoint}${options.url}`,
    };
    return axios(_options);
  }
}
