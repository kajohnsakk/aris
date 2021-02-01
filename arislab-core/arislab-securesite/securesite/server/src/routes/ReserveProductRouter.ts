import * as Express from "express";
import { ExternalProxy } from "../modules/ExternalProxy";
import { Request, Response } from "express";
import { ErrorObject } from "../utils/ErrorObject";
import { Log } from "../utils/Log";
import { ReserveProduct } from "../models/ReserveProduct";

const router = Express.Router();

const INSTANCE_NAME = process.env.INSTANCE_NAME;

interface Payload {
  productID: string;
  color?: string;
  size?: string;
}

const sendReplyReserveProductMessage = async (
  userID: string,
  productList: any
) => {
  try {
    Log.debug("Starting 'reply reserve product message'");

    let payload: Payload = {
      productID: productList[0].productID,
    };

    if (productList[0].productType === "MULTI") {
      payload.color = productList[0].productValue.colorObj.value;
      payload.size = productList[0].productValue.size;
    }

    if (productList[0].productType === "COLOR_ONLY") {
      payload.color = productList[0].productValue.colorObj.value;
      payload.size = "__COLOR_ONLY__";
    }

    const data = {
      key: "facebookid",
      value: userID,
      sender: "web",
      source: "system-event",
      channelType: "facebook",
      log_to_message_history: false,
      payload: JSON.stringify(payload),
    };

    Log.debug("sending reply reserve product message data", data);

    const reserveProductWebhookResponse = await ExternalProxy.getInstance().sendRequest(
      {
        uri: `https://${INSTANCE_NAME}.convolab.ai/chatlogic/events/confirmReserved`,
        method: "POST",
        body: data,
      }
    );

    Log.debug("Sent 'reply reserve product message' successfully");

    return reserveProductWebhookResponse;
  } catch (error) {
    Log.error("Error while sending 'reply reserve product message'", error);
    throw error;
  }
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const cartID = req.body.cartID;
    if (!cartID) {
      throw new ErrorObject("cartID is missing", 400);
    }

    const { storeID, products, customerInfo } = req.body;

    Log.debug("Requesting insert product api", req.body);

    const reserveProductResponse = await ReserveProduct.insertReserveProduct({
      cartID,
      storeID,
      products,
      customerInfo,
    });

    Log.debug("Response insert reserve product", reserveProductResponse);

    await sendReplyReserveProductMessage(customerInfo.userID, products);

    res.status(201).send(reserveProductResponse);
  } catch (error) {
    Log.error("Error while request insert product api: ", error);
    res.status(400).send({
      code: 400,
      success: true,
      message: error.message,
    });
  }
});

router.get("/status", async (req: Request, res: Response) => {
  res.render("new/reserve-product-status", { status: true });
});

module.exports = router;
