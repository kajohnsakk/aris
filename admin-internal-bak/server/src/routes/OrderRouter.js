"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("../models/Order");
const Log_1 = require("../utils/Log");
const express = require('express');
const router = express.Router();
const timeUuid = require('time-uuid');
router.get('/getAllOrder', (req, res) => __awaiter(this, void 0, void 0, function* () {
    Log_1.Log.debug('==================== getAllOrder ====================');
    Log_1.Log.debug('req query is ', req.query);
    var file = '';
    var selectedStoreID = '';
    var selectedStatus = '';
    var startDate = 0;
    var endDate = 0;
    if (req.query.file && req.query.file.length > 0) {
        file = req.query.file;
    }
    if (req.query.selectedStoreID && req.query.selectedStoreID.length > 0) {
        selectedStoreID = req.query.selectedStoreID;
    }
    if (req.query.selectedStatus && req.query.selectedStatus.length > 0) {
        selectedStatus = req.query.selectedStatus;
    }
    if (req.query.startDate && req.query.startDate > 0) {
        startDate = req.query.startDate;
    }
    if (req.query.endDate && req.query.endDate > 0) {
        endDate = req.query.endDate;
    }
    var resultAllOrder = yield Order_1.Order.findAllOrder(selectedStoreID, selectedStatus, startDate, endDate);
    let resultData;
    if (file === 'csv') {
        var csvData = yield Order_1.Order.convertJsonToCsv(resultAllOrder);
        resultData = csvData;
    }
    else {
        resultData = resultAllOrder;
    }
    res.send(resultData);
    res.end();
}));
module.exports = router;
//# sourceMappingURL=OrderRouter.js.map