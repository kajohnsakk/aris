import { Log } from "../ts-utils/Log";
import { S3 } from "aws-sdk";
const fs = require("fs");
const s3Stream = require("s3-upload-stream");

export class S3Proxy {
  private static AWS_KEY: string =
    process.env.AWS_ACCESS_KEY_ID || "AKIAZCQIHVVZ57UMQTEJ";
  private static AWS_SECRET: string =
    process.env.AWS_SECRET_ACCESS_KEY ||
    "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";
  private static S3_BUCKET: string =
    process.env.S3_BUCKET || "upload.arislab.ai";
  private static mProxy = new S3Proxy();
  static getInstance(): S3Proxy {
    return S3Proxy.mProxy;
  }
  private s3Stream: any;
  private constructor() {
    this.s3Stream = s3Stream(
      new S3({
        accessKeyId: S3Proxy.AWS_KEY,
        secretAccessKey: S3Proxy.AWS_SECRET,
      })
    );
  }

  /**
   * Upload readstream to Amazon S3
   * @param fname  Name of the file
   * @param readStream  ReadStream object of the file
   * @param mimetype  Mimetype of the file
   * @returns       Promise that resolves into URL of the file
   */
  public uploadReadstreamToS3(
    fname: string,
    readStream: any,
    mimetype: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = this.s3Stream.upload({
        Bucket: S3Proxy.S3_BUCKET,
        Key: fname,
        ACL: "public-read",
        ContentType: mimetype,
      });

      // Handle errors.
      upload.on("error", (err: any) => {
        reject(err);
      });

      // Handle progress.
      upload.on("part", (details: any) => {});

      // Handle upload completion.
      upload.on("uploaded", (details: any) => {
        Log.debug("uploaded to s3");
        details.Location = details.Location.replace("s3.amazonaws.com/", ""); //switching to cdn
        resolve(details.Location as string);
      });

      // Pipe the Readable stream to the s3-upload-stream module.
      readStream.pipe(upload);
    });
  }
  /**
   * Upload file to Amazon S3
   * @param fname  Name of the file
   * @param readStream  ReadStream object of the file
   * @param mimetype  Mimetype of the file
   * @returns       Promise that resolves into URL of the file
   */
  public uploadFileToS3(
    directory: string,
    filePath: string,
    mimetype: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr =
        filePath.indexOf("/") > -1 ? filePath.split("/") : filePath.split("\\");
      const fname =
        directory.length > 0
          ? directory + "/" + fr[fr.length - 1]
          : fr[fr.length - 1];
      return resolve(
        this.uploadReadstreamToS3(
          fname,
          fs.createReadStream(filePath),
          mimetype
        )
      );
    });
  }
}
