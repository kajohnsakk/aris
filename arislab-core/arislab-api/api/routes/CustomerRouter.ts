import * as express from "express";
import { Request, Response } from "express";
import { Customer, ICustomer } from "../models/Customer";
import { ErrorObject } from "../ts-utils/ErrorObject";
import { Log } from "../ts-utils/Log";

const router = express.Router();
const timeUuid = require("time-uuid");

router.post("/new", (req: Request, res: Response) => {
  let updateData: ICustomer;
  let requestBody = req.body as ICustomer;
  let userID = requestBody["userID"];

  requestBody["createdAt"] = Date.now();
  requestBody["isVoted"] = false;

  updateData = { ...requestBody };

  Log.debug("Creating new customer with body: ", updateData);

  let updateObj = new Customer(updateData, userID);
  res.send(updateObj.getUuid());
  res.end();
  return updateObj.update(updateData);
});

router.post("/update", (req: Request, res: Response) => {
  let updateData: ICustomer;
  let requestBody = req.body as ICustomer;
  let userID = requestBody["userID"];

  requestBody["updatedAt"] = Date.now();

  updateData = { ...requestBody };

  Log.debug(
    "Updating customer by userID " + userID + " with body: ",
    updateData
  );

  res.sendStatus(200);
  res.end();

  let updateObj = new Customer(updateData, userID);
  return updateObj.save();
});

router.get("/details", (req: Request, res: Response) => {
  let userID = req.query.userID;

  Customer.getCustomerDetails(userID).then((resultCustomerDetails) => {
    res.send(resultCustomerDetails);
    res.end();
  });
});

router.post("/userID/:userID/", (req: Request, res: Response) => {
  let userID = req.params.userID;

  Customer.getCustomerDetails(userID).then((resultCustomerDetails) => {
    res.send(resultCustomerDetails);
    res.end();
  });
});

router.post("/checkCustomerExists", (req: Request, res: Response) => {
  let storeID = req.body.storeID;
  let userID = req.body.userID;

  if (!storeID && userID) {
    throw new ErrorObject("userID is required", 400);
  } else {
    Customer.checkCustomerExists(storeID, userID).then(
      (resultCheckCustomerExists) => {
        res.send(resultCheckCustomerExists);
        res.end();
      }
    );
  }
});

module.exports = router;
