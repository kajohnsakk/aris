import { S3Proxy } from "../modules/S3Proxy";
import { Log } from "../ts-utils/Log";
import mkdirp = require("mkdirp");
import sharp = require("sharp");
import { ErrorObject } from "../ts-utils/ErrorObject";
import * as Https from "https";
const FileType = require("file-type");
import { FileTypeResult } from "file-type";

const mime = require("mime-types");
const shortUuid = require("short-uuid");
const path = require("path"),
  os = require("os"),
  fs = require("fs");
export interface FileSaveResultJson {
  url: string;
  localPath: string;
  mimeType: string;
  extension: string;
}
export class FileManager {
  private static fileTypeMap: { [key: string]: string[] } = {
    image: ["png", "jpg", "jpeg", "gif"],
    video: ["mp4", "mov", "avi"],
    zip: ["zip"],
    pdf: ["pdf"],
  };
  public static getFileType(extension: string, mimeType: string) {
    const ftype1 = this.getFileTypeByExtension(extension);
    const ftype2 = this.getFileTypeByMimeType(mimeType);
    if (ftype2.indexOf(ftype1) < 0) {
      Log.error(`extension and mimetype mismatch: ${ftype1} vs ${ftype2}`);
      return undefined;
    }
    return ftype1;
  }
  public static getFileTypeByExtension(extension: string) {
    extension = extension.toLowerCase().trim();
    for (let fileType in this.fileTypeMap) {
      if (this.fileTypeMap[fileType].indexOf(extension) >= 0) return fileType;
    }
    return undefined;
  }
  public static getFileTypeByMimeType(mimeType: string) {
    const arr = mimeType.split("/");
    const ret = arr[0];
    return ret == "application" ? arr[1] : ret;
  }
  public static analyzeMimeTypeWithUrl(url: string): Promise<FileTypeResult> {
    return new Promise((resolve) => {
      Https.get(url, (res) => {
        res.once("data", (chunk: any) => {
          res.destroy();
          const contentType = FileType(chunk);
          Log.error("contentType = " + contentType);
          resolve(contentType);
        });
      });
    });
  }
  private static mManager = new FileManager();
  static getInstance(): FileManager {
    return FileManager.mManager;
  }

  private constructor() {}

  public resizeImage(
    fname: string,
    width: number,
    newName: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = newName.split("/");
      const folder = newName.replace("/" + fr[fr.length - 1], "");
      mkdirp(folder, (err) => {
        if (err) {
          Log.error("error while crearing folder ", err);
          reject(err);
        } else {
          sharp(fname)
            .resize(width)
            .toFile(newName, (err: any, info: any) => {
              Log.debug("resizing completed width ", width, " as ", newName);
              if (err) {
                Log.error("error while resizing ", err);
                reject(err);
              } else resolve(newName);
            });
        }
      });
    });
  }

  /**
   * Process file upload from HTTP request object and upload the file to Amazon S3
   * @param req  Request Object containing the file
   * @returns       Promise that resolves when file is successfully uploaded
   */
  public processFileUploadFromRequest(req: any): Promise<FileSaveResultJson> {
    return new Promise((resolve, reject) => {
      req.pipe(req.busboy);
      const fid = "arislab/" + shortUuid.uuid();
      let saveTo: string, fname: string, ext: string, mimetype: string;
      Log.debug("Processing upload request object with fid " + fid);
      req.busboy.on(
        "file",
        (
          fieldname: string,
          file: any,
          filename: string,
          encoding: string,
          mtype: string
        ) => {
          Log.debug(
            "Busboy file event triggered with filename " +
              filename +
              " and mimeType " +
              mtype
          );
          const extr = filename.split(".");
          ext = extr.length > 1 ? extr.splice(-1)[0] : "";
          if (process.env.RESTRICT_ATTACHMENT_FORMAT) {
            const fileType = FileManager.getFileType(ext, mtype);
            if (!fileType) {
              Log.error(
                "File type is not allowed: " +
                  fileType +
                  " with extension " +
                  ext
              );
              reject(
                ErrorObject.BAD_REQUEST.cloneWithMessage("Invalid file type")
              );
            }
          } else {
            if (!ext) ext = mime.extension(mtype);
            fname = fid + "." + ext;
            saveTo = path.join(os.tmpDir(), path.basename(fname));
            mimetype = mtype;
            if (!req.query.storage || req.query.storage !== "local") {
              let fileUrl = "";
              S3Proxy.getInstance()
                .uploadReadstreamToS3(fname, file, mimetype)
                .then((loc) => {
                  fileUrl = loc;
                  return FileManager.analyzeMimeTypeWithUrl(fileUrl);
                })
                .then((result) => {
                  if (
                    process.env.RESTRICT_ATTACHMENT_FORMAT &&
                    (!result ||
                      !result.mime ||
                      !FileManager.getFileType(ext, result.mime))
                  )
                    reject(
                      ErrorObject.BAD_REQUEST.cloneWithMessage(
                        "Invalid file type"
                      )
                    );
                  else
                    resolve({
                      url: fileUrl,
                      localPath: saveTo,
                      mimeType: mtype,
                      extension: ext,
                    });
                });
              file.pipe(fs.createWriteStream(saveTo));
            } else {
              const queryPath = req.query.path || ".";
              saveTo = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "convolab-console/console/public",
                queryPath,
                filename
              );
              const fileStream = fs.createWriteStream(saveTo);
              const consolePath = path.join("/console", queryPath, filename);
              file.pipe(fileStream);
              fileStream.on("close", () => {
                resolve({
                  url: consolePath,
                  localPath: saveTo,
                  mimeType: mtype,
                  extension: ext,
                });
              });
            }
          }
        }
      );
    });
  }

  public processFilePathUploadFromRequest(
    directory: string,
    filePath: string,
    mimeType: string
  ): Promise<FileSaveResultJson> {
    return new Promise((resolve, reject) => {
      let fileUrl = "";
      const extr = filePath.split(".");
      let ext = extr.length > 1 ? extr.splice(-1)[0] : "";
      S3Proxy.getInstance()
        .uploadFileToS3(directory, filePath, mimeType)
        .then((loc) => {
          fileUrl = loc;
          return FileManager.analyzeMimeTypeWithUrl(fileUrl);
        })
        .then((result: any) => {
          if (
            process.env.RESTRICT_ATTACHMENT_FORMAT &&
            (!result ||
              !result.mime ||
              !FileManager.getFileType(ext, result.mime))
          )
            reject(
              ErrorObject.BAD_REQUEST.cloneWithMessage("Invalid file type")
            );
          else
            resolve({
              url: fileUrl,
              localPath: "",
              mimeType: mimeType,
              extension: ext,
            });
        });
    });
  }
}
