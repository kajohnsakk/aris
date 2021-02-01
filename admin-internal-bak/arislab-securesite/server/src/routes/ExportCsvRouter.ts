import * as Express from "express";
import { ErrorObject } from "../utils/ErrorObject";
import { Log } from "../utils/Log";
import { ExternalProxy } from "../modules/ExternalProxy";
import { Channel } from "../models/Channel";
const authMiddleware = require("../middlewares/auth.middleware");

const router = Express.Router();

router.get("/order", (req: any, res: any) => {
  ExternalProxy.getInstance()
    .sendRequest({
      uri: `http://localhost:1780/api/order/getAllOrder?file=csv&selectedStoreID=${req.query.selectedStoreID}&selectedStatus=${req.query.selectedStatus}&startDate=${req.query.startDate}&endDate=${req.query.endDate}`,
      method: "get",
    })
    .then((resultOrderCsv: any) => {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + "order-" + Date.now() + '.csv"'
      );
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Pragma", "no-cache");
      res.write("\ufeff" + resultOrderCsv, "utf-8");
      res.end();
    });
});

router.get("/fundsTransaction", authMiddleware(), (req: any, res: any) => {
  Log.debug("[ExportCsvRouter][FundsTransaction] Sending req");
  ExternalProxy.getInstance()
    .sendRequest({
      uri: `http://localhost:1780/api/fundsTransaction/getFundsTransactionList?file=csv&selectedStoreID=${req.query.selectedStoreID}&startDate=${req.query.startDate}&endDate=${req.query.endDate}`,
      method: "get",
    })
    .then((resultFundsTransactionCSV: any) => {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + "fundsTransaction-" + Date.now() + '.csv"'
      );
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Pragma", "no-cache");
      res.write("\ufeff" + resultFundsTransactionCSV, "utf-8");
      res.end();
    });
});

module.exports = router;
