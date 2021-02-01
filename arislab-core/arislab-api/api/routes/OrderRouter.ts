import * as express from "express";
import { Request, Response } from "express";
import { JSONData as OrderJSON, Order, selectedProductJSON } from "../models/Order";
import { ErrorObject } from "../ts-utils/ErrorObject";
import { Utils } from "../ts-utils/Utils";
import { Log } from "../ts-utils/Log";
import { ExternalProxy } from "../modules/ExternalProxy";
import * as AppConfig from "../config/AppConfig";

const router = express.Router();
const timeUuid = require("time-uuid");

const INSTANCE_NAME = process.env.INSTANCE_NAME || AppConfig.INSTANCE_NAME;

router.get("/storeID/:storeID/", (req: Request, res: Response) => {
  let storeID = req.params.storeID;
  let file = req.query.file;
  let status = req.query.status || "";
  let startDate = req.query.startDate || "";
  let endDate = req.query.endDate || "";
  let dateFilter = req.query.dateFilter;

  Order.findById(storeID, status, startDate, endDate, dateFilter).then(
    (resultFindByID: any) => {
      if (file || file === "csv") {
        Order.exportToCsv(
          storeID,
          resultFindByID.sort((a: any, b: any) => {
            if (status === "SUCCESS") {
              return (
                b.paymentInfo.paymentCompletedOn -
                a.paymentInfo.paymentCompletedOn
              );
            } else {
              return b.orderDate - a.orderDate;
            }
          })
        ).then((csvFile) => {
          let filename = `arislab_export_order_${Date.now()}.csv`;

          res.writeHead(200, {
            "Content-disposition": `attachment; filename=${filename}`,
            "Content-Type": "text/csv; charset=utf-8",
          });
          res.write("\ufeff" + csvFile, "utf-8");
          res.end();
        });
      } else {
        res.send(resultFindByID);
        res.end();
      }
    }
  );
});

router.get(
  "/storeID/:storeID/orderID/:orderID",
  (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let orderID = req.params.orderID;

    Order.findByOrderId(storeID, orderID).then((resultFindByOrderID: any) => {
      res.send(resultFindByOrderID);
      res.end();
    });
  }
);

router.get("/findByOrderDocID", (req: Request, res: Response) => {
  let orderID = req.query.orderID;

  if (!orderID) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    Order.findByDocId(orderID).then((resultFindByDocId: any) => {
      res.send(resultFindByDocId);
      res.end();
    });
  }
});

router.post("/new", async (req: Request, res: Response) => {
  let orderDocID = timeUuid();
  let updateData: OrderJSON;
  let requestBody = req.body as OrderJSON;

  do {
    requestBody["orderID"] = Utils.createUUID();
    let fieldObj = { fieldName: "orderID", fieldValue: requestBody["orderID"] };
    var checkDuplicate = await Order.findByCustomField(fieldObj);
  } while (checkDuplicate.length > 0);
  requestBody["orderDate"] = Date.now();

  updateData = { ...requestBody };

  Log.debug("Creating new order with body: ", updateData);

  let updateObj = new Order(updateData, orderDocID);
  res.send({
    _id: updateObj.getUuid(),
    orderID: requestBody["orderID"],
    paymentReferenceNo: requestBody["paymentInfo"]["referenceNo"],
  });
  res.end();
  return updateObj.update(updateData);
});

router.post(
  "/storeID/:storeID/orderID/:orderID/update",
  (req: Request, res: Response) => {
    let orderID = req.params.orderID;
    let updateObj = req.body;

    Order.updateByOrderId(orderID, updateObj).then(
      (resultUpdateByOrderId: any) => {
        res.send(resultUpdateByOrderId);
        res.end();
      }
    );
  }
);

router.post("/findProductIDInOrder", (req: Request, res: Response) => {
  let storeID = req.body.storeID;
  let productID = req.body.productID;

  if (!storeID && !productID) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    Order.findOrdersByProductID(storeID, productID).then(
      (resultFindOrdersByProductID) => {
        res.send(resultFindOrdersByProductID);
        res.end();
      }
    );
  }
});

router.post("/findByCustomer", (req: Request, res: Response) => {
  let storeID = req.body.storeID;
  let userID = req.body.userID;
  let timestamp = req.body.timestamp;
  if (!storeID && !userID && !timestamp) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    Order.findOrderByCustomerWithCustomRange(storeID, userID, timestamp).then(
      (resultFindOrderByCustomerWithCustomRange) => {
        res.send(resultFindOrderByCustomerWithCustomRange);
        res.end();
      }
    );
  }
});

router.get("/findOrdersByStatus", (req: Request, res: Response) => {
  let status = req.query.status;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let storeID = req.query.storeID || "";

  if (!status) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    Order.findByOrderStatus(status, startDate, endDate, storeID).then(
      (resultFindByOrderStatus) => {
        res.send(resultFindByOrderStatus);
        res.end();
      }
    );
  }
});

router.post("/findByCustomField", (req: Request, res: Response) => {
  let fieldName = req.body.fieldName;
  let fieldValue = req.body.fieldValue;

  if (!fieldName && fieldValue) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    let fieldObj = {
      fieldName: fieldName,
      fieldValue: fieldValue,
    };
    Order.findByCustomField(fieldObj).then((resultFindByCustomField) => {
      res.send(resultFindByCustomField);
      res.end();
    });
  }
});

router.post("/checkReturningUser", (req: Request, res: Response) => {
  let storeID = req.body.storeID;
  let userID = req.body.userID;

  if (!storeID && !userID) {
    throw ErrorObject.NULL_OBJECT;
  } else {
    Order.checkReturningUser(userID, storeID).then(
      (resultCheckReturningUser: any) => {
        res.send(resultCheckReturningUser);
        res.end();
      }
    );
  }
});

router.get("/orderID/:orderID", (req: Request, res: Response) => {
  let orderID = req.params.orderID;

  Order.findOrderByOrderId(orderID).then((resultFindOrderByID: any) => {
    res.send(resultFindOrderByID);
    res.end();
  });
});

router.post("/updateCode", async (req: Request, res: Response) => {
  let order: Order;
  let data: any[] = req.body;
  try {
    const orders = await Order.findOrderByOrderId(data[0].orderID);
    order = orders[0];
  } catch (error) {
    Log.debug("Error finding order in /api/order/upload");
    return null;
  }
  let selectedProduct: any = [];
  order.selectedProduct.forEach(product => {
    if (!product['code']) {
      product['code'] = []
    }
    data.forEach(obj => {
      if (product.productID === obj.productID) {
        if (obj.prevCode !== "") {
          product.code[product.code.indexOf(obj.prevCode)] = obj.code
        }
        else {
          product.code.push(obj.code)
        }
      }
    });
    selectedProduct.push(product)
  });
  let updatedOrder = {
    ...order,
    selectedProduct: selectedProduct
  }
  await Order.updateByOrderId(order.orderDocID, updatedOrder);
})

router.post("/send/voucher", async (req: Request, res: Response) => {
  let order: Order;
  let data = req.body;
  try {
    const orders = await Order.findOrderByOrderId(data.orderID);
    order = orders[0];
  } catch (error) {
    Log.debug("Error finding order in /api/order/upload");
    return null;
  }
  if (order) {
    let payload = {
      code: data.code,
      productName: data.productName
    };
    let dataForApi = {
      key: "facebookid",
      value: order.userID,
      sender: "web",
      source: "system-event",
      channelType: "facebook",
      log_to_message_history: false,
      payload: JSON.stringify(payload),
    };
    try {
      const response = await ExternalProxy.getInstance()
        .sendRequest({
          uri: `https://${INSTANCE_NAME}.convolab.ai/chatlogic/events/sendVoucher`,
          method: "POST",
          body: dataForApi,
        })
      res.status(200).send("OK");
      res.end();
    }
    catch (error) {
      res.send("Request error");
      res.end();
    }
  } else {
    res.send("Error: Can not find orderID");
  }
})

router.post("/send/tracking", async (req: Request, res: Response) => {
  let order: Order;
  let data = req.body;

  Log.debug("Send tracking number of order: ", data.orderID);
  order = await Order.findOrderByOrderId(data.orderID)
    .then((resultFindOrderByID: Array<Order>) => {
      return resultFindOrderByID[0];
    })
    .catch((err) => {
      Log.debug("Error finding order in /api/order/upload");
      return null;
    });
  if (order) {
    if (order.isTrackingSent === false) {
      // Post to chatbot
      let payload = {
        messageType: "POST_PURCHASE",
        trackingNumber: data.trackingNumber,
        shippingMethod: data.shippingMethod,
      };
      let dataForApi = {
        key: "facebookid",
        value: order.userID,
        sender: "web",
        source: "system-event",
        channelType: "facebook",
        log_to_message_history: false,
        payload: JSON.stringify(payload),
      };

      await ExternalProxy.getInstance()
        .sendRequest({
          uri: `https://${INSTANCE_NAME}.convolab.ai/chatlogic/events/sendTracking`,
          method: "POST",
          body: dataForApi,
        })
        .then(async (response: any) => {
          Log.debug("response from /send/tracking", response);
          let updatedOrder = {
            ...order,
            shippingMethod: data.shippingMethod,
            trackingNumber: data.trackingNumber,
            isTrackingSent: true,
            shippingStatus: "SENT",
          };

          await Order.updateByOrderId(order.orderDocID, updatedOrder);
          res.status(200).send("OK");
          res.end();
        })
        .catch(() => {
          res.send("Request error");
          res.end();
        });
    } else {
      // Just send to user for ux purpose (Progress bar)
      res.status(200).send("OK");
    }
  } else {
    res.send("Error: Can not find orderID");
  }
});

module.exports = router;
