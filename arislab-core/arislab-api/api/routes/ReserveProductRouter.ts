import * as express from "express";
import { Request, Response } from "express";
import { ReserveProduct } from "../models/ReserveProduct";
import { Log } from "../ts-utils/Log";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    Log.debug("Inserting reserve product", req.body.data);

    let { cartID, storeID, products, customerInfo } = req.body.data;

    const reserveProduct = new ReserveProduct(
      cartID,
      storeID,
      customerInfo,
      products
    );
    const reserveProductResponse = await reserveProduct.update({
      cartID,
      storeID,
      customerInfo,
      products,
    });

    Log.debug("Reserve product was inserted successfully ", {
      ...reserveProductResponse,
    });

    res.status(201).send({
      code: 201,
      success: true,
      data: reserveProductResponse,
      message: "Reserve product was inserted successfully",
    });
  } catch (error) {
    Log.debug("Error while insert reserve product", error);
    res.status(400).send({
      code: 400,
      success: false,
      message: error.message,
    });
  }
});

router.get("/report/download/:storeID", async (req: Request, res: Response) => {
  try {
    const storeID = req.params.storeID || req.query.storeID;
    if (!storeID) {
      throw new Error("StoreID is required");
    }

    Log.debug("Exporting reserve product report with storeID ", storeID);

    const csvFile = await ReserveProduct.exportToCsv(storeID);

    Log.debug("Reserve product report was generated");

    let filename = `arislab_export_reserve_product_${Date.now()}.csv`;
    res.writeHead(200, {
      "Content-disposition": `attachment; filename=${filename}`,
      "Content-Type": "text/csv; charset=utf-8",
    });

    Log.debug("Reserve product report was already to download");

    res.write("\ufeff" + csvFile, "utf-8");
    res.end();
  } catch (error) {
    Log.debug("Error while insert reserve product", error);
    res.status(400).send({
      code: 400,
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
