import { Log } from "../ts-utils/Log";
import { BusinessProfile } from "../models/BusinessProfile";

const express = require("express");
const router = express.Router();

const isEmailAddress = (str: string) => {
  var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return pattern.test(str);
};

/**
 * Find store by email or storeID
 */
router.get("/:storeID", async (req: any, res: any) => {
  try {
    const storeID = req.params.storeID;

    Log.debug(`Finding store with ${storeID}`);

    const isEmail = isEmailAddress(storeID);

    const stores = isEmail
      ? await BusinessProfile.findStoreByEmail(storeID)
      : await BusinessProfile.findStoreByID(storeID);
    const foundStore = stores.length > 0;

    if (!foundStore) {
      return res.status(200).send({
        status: false,
        message: "Store not found",
      });
    }

    Log.debug("Found store ", stores[0]._source);

    res.status(200).send({
      status: true,
      data: stores[0]._source,
    });
  } catch (error) {
    Log.debug("Error while find store", error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
});

/**
 * Find store by auth0ID
 */
router.get("/auth0/:auth0ID", async (req: any, res: any) => {
  try {
    const auth0ID = req.params.auth0ID;

    Log.debug(`Finding store by auth0ID ${auth0ID}`);

    const stores = await BusinessProfile.findByAuth0ID(auth0ID);
    const foundStore = stores.length > 0;

    if (!foundStore) {
      return res.status(200).send({
        status: false,
        message: "Store not found",
      });
    }

    Log.debug("Found store ", stores[0]);

    res.status(200).send({
      status: true,
      data: stores[0],
    });
  } catch (error) {
    Log.debug("Error while find store", error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
});

router.put("/:storeID/paymentInfo", async (req: any, res: any) => {
  try {
    const storeID = req.params.storeID;
    const params = req.body;

    Log.debug(
      `Starting to update paymentInfo with storeID ${storeID}`,
      req.body
    );

    const foundBusinessProfile = await BusinessProfile.findById(storeID);
    const paymentInfo = foundBusinessProfile.storeInfo.paymentInfo;

    foundBusinessProfile.storeInfo = {
      ...foundBusinessProfile.storeInfo,
      paymentInfo: {
        ...paymentInfo,
        ...params,
      },
    };

    const businessProfile = new BusinessProfile(foundBusinessProfile);
    await businessProfile.update(businessProfile);

    Log.debug("paymentInfo was updated");

    res.status(200).send({
      status: true,
      message: "Payment info was updated",
    });
  } catch (error) {
    log.debug("Error while update paymentInfo", error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
