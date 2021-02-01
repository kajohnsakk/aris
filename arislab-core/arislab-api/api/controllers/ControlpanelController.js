"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../ts-utils/Log");
const helpers_1 = require("../helpers");
const StoreV2_1 = require("../models/StoreV2");
class ControlPanelController {
    storeAccess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const { storeID } = body;
                Log_1.Log.debug("Accessing to store by storeID ", storeID);
                Log_1.Log.debug("Finding store");
                const store = new StoreV2_1.default();
                const storeResponse = yield store.findStoreByIDs(storeID);
                const stores = storeResponse.hits.hits;
                if (stores.length === 0) {
                    Log_1.Log.debug("Store not found");
                    helpers_1.response(res, 400, "Store not found");
                    return;
                }
                const authID = stores[0]._source.auth0_uid;
                Log_1.Log.debug("Found store you can access with authID ", authID);
                helpers_1.response(res, 200, "Found store you can access with authID", { authID });
            }
            catch (error) {
                Log_1.Log.debug("Could not access to store ", error);
                helpers_1.response(res, 400, error.message);
            }
        });
    }
}
exports.default = ControlPanelController;
//# sourceMappingURL=ControlpanelController.js.map