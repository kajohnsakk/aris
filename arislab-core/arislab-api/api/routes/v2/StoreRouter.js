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
const Log_1 = require("../../ts-utils/Log");
const StoreV2_1 = require("../../models/StoreV2");
const helpers_1 = require("../../helpers");
const express = require("express");
const router = express.Router();
const { validate, Joi } = require("express-validation");
const findStoreSchema = {
    params: Joi.object({
        storeID: Joi.string().required(),
    }),
};
router.get("/:storeID", validate(findStoreSchema, {}, {}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params } = req;
        let storeInfo = {};
        Log_1.Log.debug("Finding store by ", params.storeID);
        const store = new StoreV2_1.default();
        const storebyIDResponse = yield store.findStoreByIDs(params.storeID);
        if (storebyIDResponse.hits.total === 0) {
            const storeByEmailResponse = yield store.findStoreByEmail(params.storeID);
            if (storeByEmailResponse.hits.total === 0) {
                Log_1.Log.debug("Store not found");
                helpers_1.response(res, 400, "Store not found");
                return;
            }
            storeInfo = storeByEmailResponse.hits.hits[0];
        }
        else {
            storeInfo = storebyIDResponse.hits.hits[0];
        }
        Log_1.Log.debug("Found store ", storeInfo);
        helpers_1.response(res, 200, "Found store", Object.assign({}, storeInfo._source));
    }
    catch (error) {
        Log_1.Log.debug("Could not find store ", error);
        helpers_1.response(res, 400, error.message);
    }
}));
module.exports = router;
//# sourceMappingURL=StoreRouter.js.map