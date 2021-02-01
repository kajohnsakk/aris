import * as Express from "express";
import { Request, Response } from "express";
import { ErrorObject } from "../utils/ErrorObject";
import { Log } from "../utils/Log";
import { CartManager } from "../models/CartManager";
import { ApiProxy } from "../modules/ApiProxy";
import { CustomerManager } from "../models/CustomerManager";
import { StoreManager } from "../models/StoreManager";
import { Payment } from "../models/Payment";

const router = Express.Router();

router.get("/details", async (req: Request, res: Response) => {
  const cartID = req.query.cartID;

  if (!cartID) {
    throw new ErrorObject("cartID is missing", 400);
  } else {
    try {
      let resultCartDetails = await CartManager.getCartDetails(cartID);

      const resultStoreDetails = await StoreManager.getStoreDetails(
        resultCartDetails["storeID"]
      );
      const resultCustomerDetails = await CustomerManager.checkCustomerExists(
        resultCartDetails["storeID"],
        resultCartDetails["userID"]
      );

      const storeConfig = resultStoreDetails["storeInfo"]["config"] || {};

      let renderObj = {};
      let customerDetails;
      let productIsEqual = true;

      if (resultCustomerDetails["exists"]) {
        renderObj["customerDetails"] = resultCustomerDetails["result"][0];
        customerDetails = resultCustomerDetails["result"][0];
      }

      if (resultCartDetails["status"] === "CLOSED") {
        renderObj["isPaidOrder"] = true;
      }

      if (
        resultCustomerDetails["exists"] &&
        StoreManager.hasServiceConfig(resultStoreDetails["storeInfo"])
      ) {
        renderObj["serviceConfig"] =
          resultStoreDetails["storeInfo"]["serviceConfig"];
        let serviceConfig = resultStoreDetails["storeInfo"]["serviceConfig"];

        const resultCheckServiceConfig = await StoreManager.checkServiceConfig(
          serviceConfig,
          resultCartDetails,
          customerDetails
        );

        Log.debug(
          "[CartRouter][/details] resultCheckServiceConfig ",
          resultCheckServiceConfig
        );
        resultCartDetails = await CartManager.getCartDetails(cartID);
      }
      let productsFromDB: any = [];
      let requestData: any = [];
      resultCartDetails.selectedProduct.forEach(async (product: any) => {
        let hashtag = product.productHashtag;
        requestData.push({
          storeID: resultStoreDetails["storeID"],
          hashtag: hashtag,
        });
      });

      const responseData = await Promise.all(
        requestData.map((data: any) =>
          ApiProxy.getInstance().sendRequest(
            "GET",
            `/product/storeID/${data["storeID"]}/product/productHashtag/${
              data["hashtag"]
            }/details`
          )
        )
      );

      Log.debug("response Data :", responseData);

      productsFromDB = responseData;
      Log.debug("product from DB :", productsFromDB);

      for (
        let index = 0;
        index < resultCartDetails.selectedProduct.length;
        index++
      ) {
        let product = resultCartDetails.selectedProduct[index];
        let productPriceFromDB: number;
        let productIsNotAvailable: boolean = false;
        if (
          product.productType === "SINGLE" ||
          product.productType === "VOUCHER"
        ) {
          productPriceFromDB =
            productsFromDB[index][0].productInfo.productUniversalInfo.price;
          productIsNotAvailable =
            productsFromDB[index][0].productInfo.isNotAvailable;
        }
        if (
          product.productType === "MULTI" ||
          product.productType === "COLOR_ONLY"
        ) {
          let colorIndex: number;
          let size = product.productValue.size;
          productsFromDB[index][0].productInfo.productVariations.forEach(
            (productVariation: any, index: number) => {
              if (
                productVariation.color === product.productValue.colorObj.value
              )
                colorIndex = index;
            }
          );
          if (product.productType === "MULTI") {
            productPriceFromDB =
              productsFromDB[index][0].productInfo.productVariations[colorIndex]
                .size[size].value.price;
            productIsNotAvailable =
              productsFromDB[index][0].productInfo.productVariations[colorIndex]
                .size[size].value.isNotAvailable;
          }
          if (product.productType === "COLOR_ONLY") {
            productPriceFromDB =
              productsFromDB[index][0].productInfo.productVariations[colorIndex]
                .size["__COLOR_ONLY__"].value.price;
            productIsNotAvailable =
              productsFromDB[index][0].productInfo.productVariations[colorIndex]
                .size["__COLOR_ONLY__"].value.isNotAvailable;
          }
        }
        if (
          productIsNotAvailable ||
          product.productNameWithoutColor !==
            productsFromDB[index][0].productInfo.productName ||
          product.productValue.price !== productPriceFromDB
        ) {
          Log.debug("productNameCart : ", product.productNameWithoutColor);
          Log.debug(
            "productNameDB : ",
            productsFromDB[index][0].productInfo.productName
          );
          Log.debug("productPriceCart : ", product.productValue.price);
          Log.debug("productPriceDB : ", productPriceFromDB);
          productIsEqual = false;
        }
      }

      renderObj["isCustomerExists"] = resultCustomerDetails.exists;
      renderObj["cartDetails"] = resultCartDetails;
      renderObj["storeConfig"] = storeConfig;
      renderObj["timestamp"] = Date.now();
      renderObj["productIsEqual"] = productIsEqual;
      if (!productIsEqual) {
        ApiProxy.getInstance().sendRequest(
          "POST",
          `/cart/update?cartID=${resultCartDetails.cartID}`,
          {
            status: "CLOSE",
          }
        );
      }

      Log.debug("Rendering cart with obj ", renderObj);
      res.render("new/cart", renderObj);
    } catch (error) {
      Log.error("Error while rendering cart details page: ", error);
      throw error;
    }
  }
});

router.get("/delivery", async (req: Request, res: Response) => {
  const cartID = req.query.cartID;

  if (!cartID) {
    throw new ErrorObject("cartID is missing", 400);
  } else {
    try {
      let resultCartDetails = await CartManager.getCartDetails(cartID);

      const resultStoreDetails = await StoreManager.getStoreDetails(
        resultCartDetails["storeID"]
      );
      const resultCustomerDetails = await CustomerManager.checkCustomerExists(
        resultCartDetails["storeID"],
        resultCartDetails["userID"]
      );

      Log.debug("resultStoreDetails : ", resultStoreDetails);

      let renderObj = {};
      let customerDetails;

      renderObj["isCustomerExists"] = resultCustomerDetails.exists;
      renderObj["cartDetails"] = resultCartDetails;
      renderObj["timestamp"] = Date.now();
      renderObj["isEnableTaxInvoice"] = false;
      renderObj["isLegalEntity"] = true;
      renderObj["isHeadOffice"] = true;
      renderObj["storeIsEnableTaxInvoice"] =
        resultStoreDetails["storeInfo"]["config"]["useTaxInvoice"];
      renderObj["storeInfo"] = {
        enabledEditProductHashtag: !!resultStoreDetails.storeInfo.config
          .enabledEditProductHashtag,
        enabledReserveProduct: !!resultStoreDetails.storeInfo.config
          .enabledReserveProduct,
      };
      Log.debug("Store is enable : ", renderObj["storeIsEnableTaxInvoice"]);

      if (resultCustomerDetails["exists"]) {
        renderObj["customerDetails"] = resultCustomerDetails["result"][0];
        customerDetails = resultCustomerDetails["result"][0];
        renderObj["isEnableTaxInvoice"] = customerDetails["isEnableTaxInvoice"];
        if (
          customerDetails["customerTaxInvoiceDetails"]["personType"] ===
          "INDIVIDUAL"
        )
          renderObj["isLegalEntity"] = false;
        if (
          customerDetails["customerTaxInvoiceDetails"]["businessType"] ===
          "BRANCH"
        )
          renderObj["isHeadOffice"] = false;
      }

      if (
        resultCustomerDetails["exists"] &&
        StoreManager.hasServiceConfig(resultStoreDetails["storeInfo"])
      ) {
        renderObj["serviceConfig"] =
          resultStoreDetails["storeInfo"]["serviceConfig"];
        let serviceConfig = resultStoreDetails["storeInfo"]["serviceConfig"];

        const resultCheckServiceConfig = await StoreManager.checkServiceConfig(
          serviceConfig,
          resultCartDetails,
          customerDetails
        );

        Log.debug(
          "[CartRouter][/delivery] resultCheckServiceConfig ",
          resultCheckServiceConfig
        );
        resultCartDetails = await CartManager.getCartDetails(cartID);
      }

      if (!resultStoreDetails["storeInfo"]["config"]["useTaxInvoice"])
        renderObj["isEnableTaxInvoice"] = false;

      Log.debug("Rendering delivery with obj", renderObj);
      res.render("new/delivery", renderObj);
    } catch (error) {
      Log.error("Error while rendering delivery page: ", error);
      throw error;
    }
  }
});

router.get("/payments", async (req: Request, res: Response) => {
  let cartID = req.query.cartID;

  if (!cartID) {
    throw new ErrorObject("cartID is missing", 400);
  } else {
    try {
      let renderObj = {};
      const resultCartDetails = await CartManager.getCartDetails(cartID);
      const resultCustomerDetails = await CustomerManager.checkCustomerExists(
        resultCartDetails["storeID"],
        resultCartDetails["userID"]
      );
      const resultCreateQRCode = await Payment.createQRCode({
        amount: resultCartDetails["summary"]["grandTotal"],
      });

      let imageBase64 = new Buffer(resultCreateQRCode).toString("base64");

      renderObj["isCustomerExists"] = resultCustomerDetails.exists;
      renderObj["cartDetails"] = resultCartDetails;
      renderObj["qrcodeInfo"] = imageBase64;
      renderObj["timestamp"] = Date.now();

      if (resultCustomerDetails["exists"]) {
        renderObj["customerDetails"] = resultCustomerDetails["result"][0];
      }

      Log.debug("Rendering payments with obj", renderObj);
      res.render("new/payments", renderObj);
    } catch (error) {
      Log.error("Error while rendering payments page: ", error);
      throw error;
    }
  }
});

router.post("/updateCartItem", (req: Request, res: Response) => {
  const cartID = req.query.cartID;
  const mode = req.query.mode.toUpperCase();
  const productInfo = req.body;

  if (!cartID && productInfo && mode) {
    throw new ErrorObject("Required fields are missing", 400);
  } else {
    CartManager.updateCartItem(cartID, productInfo, mode).then(
      (resultUpdateItemInCart) => {
        res.send(resultUpdateItemInCart);
        res.end();
      }
    );
  }
});

router.post("/removeCartItem", (req: Request, res: Response) => {
  const cartID = req.query.cartID;
  const productInfo = req.body;

  if (!cartID && productInfo) {
    throw new ErrorObject("Required fields are missing", 400);
  } else {
    CartManager.removeCartItem(cartID, productInfo).then(
      (resultRemoveCartItem) => {
        res.send(resultRemoveCartItem);
        res.end();
      }
    );
  }
});

router.get("/buyNow", (req: Request, res: Response) => {
  const data = req.query.data;

  if (!data) {
    throw new ErrorObject("Data querystring are missing", 400);
  } else {
    CartManager.openBuyNowLink(data).then((resultOpenBuyNowLink) => {
      res.redirect(
        `${resultOpenBuyNowLink["destination"]}?cartID=${
          resultOpenBuyNowLink["cartID"]
        }`
      );
    });
  }
});

router.get("/verifyCartInventory", (req: Request, res: Response) => {
  const encodedCartID = req.query.id;
  const cartID = Buffer.from(encodedCartID, "base64").toString();

  if (!cartID) {
    throw new ErrorObject("Data querystring are missing", 400);
  } else {
    CartManager.verifyCartInventory(cartID).then(
      (resultVerifyCartInventory) => {
        res.send(resultVerifyCartInventory);
        res.end();
      }
    );
  }
});

router.get("/status", (req: Request, res: Response) => {
  let status = req.query.status;

  res.render("new/status");
});

router.get("/loading", (req: Request, res: Response) => {
  res.render("new/loading");
});

router.post("/status", (req: Request, res: Response) => {
  const resultCode = req.body.resultCode;
  const cod = req.body.cod;

  let status = false;
  if (resultCode === "00") {
    status = true;
  }
  console.log("=============== *start* gbpay post request ===================");
  console.log(req.body);
  console.log("=============== *end* gbpay post request ===================");
  res.render("new/status", { status: status, cod: cod });
});

module.exports = router;
