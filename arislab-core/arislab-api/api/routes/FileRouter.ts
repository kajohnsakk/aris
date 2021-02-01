import { FileManager } from "../components/FileManager";
import { Log } from "../ts-utils/Log";
import { ErrorObject } from "../ts-utils/ErrorObject";
import * as express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  Log.debug("New file upload request accepted");

  FileManager.getInstance()
    .processFileUploadFromRequest(req)
    .then((saveResult) => {
      res.statusCode = 200;
      Log.debug("request successful");
      res.json({
        link: saveResult.url,
      });
      res.end();
    })
    .catch((err: any) => {
      if (err instanceof ErrorObject) {
        err.send(res);
      } else {
        res.statusCode = 400;
        Log.error("error while uploading to s3 ", err);
        res.json({
          error: err,
        });
        res.end();
      }
    });
});

router.post("/path", (req: Request, res: Response) => {
  Log.debug("New file upload request accepted");

  let filePath = req.body.filePath;
  let mimeType = req.body.mimeType;
  let directory = req.body.hasOwnProperty("directory")
    ? req.body.directory
    : "";

  FileManager.getInstance()
    .processFilePathUploadFromRequest(directory, filePath, mimeType)
    .then((saveResult) => {
      res.statusCode = 200;
      Log.debug("request successful");
      res.json({
        link: saveResult.url,
      });
      res.end();
    })
    .catch((err: any) => {
      if (err instanceof ErrorObject) {
        err.send(res);
      } else {
        res.statusCode = 400;
        Log.error("error while uploading to s3 ", err);
        res.json({
          error: err,
        });
        res.end();
      }
    });
});

module.exports = router;
