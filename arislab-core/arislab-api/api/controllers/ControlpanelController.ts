import { Log } from "../ts-utils/Log";
import { response } from "../helpers";

import Store from "../models/StoreV2";

export default class ControlPanelController {
  async storeAccess(req: any, res: any) {
    try {
      const { body } = req;
      const { storeID } = body;

      Log.debug("Accessing to store by storeID ", storeID);

      Log.debug("Finding store");
      const store = new Store();
      const storeResponse = await store.findStoreByIDs(storeID);
      const stores = storeResponse.hits.hits;

      if (stores.length === 0) {
        Log.debug("Store not found");
        response(res, 400, "Store not found");
        return;
      }

      const authID = stores[0]._source.auth0_uid;

      Log.debug("Found store you can access with authID ", authID);
      response(res, 200, "Found store you can access with authID", { authID });
    } catch (error) {
      Log.debug("Could not access to store ", error);
      response(res, 400, error.message);
    }
  }
}
