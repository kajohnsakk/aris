import { Log } from "../../ts-utils/Log";
import Store from "../../models/StoreV2";
import { response } from "../../helpers";

const express = require("express");
const router = express.Router();

const { validate, Joi } = require("express-validation");

const findStoreSchema = {
  params: Joi.object({
    storeID: Joi.string().required(),
  }),
};

router.get(
  "/:storeID",
  validate(findStoreSchema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { params } = req;
      let storeInfo: any = {};

      Log.debug("Finding store by ", params.storeID);

      const store = new Store();
      const storebyIDResponse = await store.findStoreByIDs(params.storeID);

      if (storebyIDResponse.hits.total === 0) {
        const storeByEmailResponse = await store.findStoreByEmail(
          params.storeID
        );

        if (storeByEmailResponse.hits.total === 0) {
          Log.debug("Store not found");
          response(res, 400, "Store not found");
          return;
        }

        storeInfo = storeByEmailResponse.hits.hits[0];
      } else {
        storeInfo = storebyIDResponse.hits.hits[0];
      }

      Log.debug("Found store ", storeInfo);

      response(res, 200, "Found store", {
        ...storeInfo._source,
      });
    } catch (error) {
      Log.debug("Could not find store ", error);
      response(res, 400, error.message);
    }
  }
);

module.exports = router;
