import { responseHelper } from "../helpers";
import fs from "fs";

import config from "../config/config";
const { upload } = config;

const csv = require("csvtojson");

const moveFileToDir = (file: any) => {
  return new Promise((resolve, reject) => {
    file.mv(`${upload.path}/${file.name}`, (error: any) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

class GenerateLabelController {
  async uploadFile(req: any, res: any) {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error("File upload not found");
    }

    if (!fs.existsSync(upload.path)) {
      fs.mkdirSync(upload.path);
    }

    let orderFile = req.files.order_file;

    try {
      await moveFileToDir(orderFile);
      const orders = await csv().fromFile(`${upload.path}/${orderFile.name}`);
      fs.unlinkSync(`${upload.path}/${orderFile.name}`);

      const payload = responseHelper({
        statusCode: 200,
        message: "Success",
        data: orders,
      });

      res.send(payload);
    } catch (error) {
      const payload = responseHelper({
        statusCode: 400,
        message: error.message,
      });
      res.send(payload);
    }
  }
}

export default new GenerateLabelController();
