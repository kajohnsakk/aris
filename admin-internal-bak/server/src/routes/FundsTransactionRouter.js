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
const FundsTransaction_1 = require("../models/FundsTransaction");
const Log_1 = require("../utils/Log");
const express = require('express');
const router = express.Router();
const timeUuid = require('time-uuid');
router.get('/getFundsTransactionList', (req, res) => __awaiter(this, void 0, void 0, function* () {
    Log_1.Log.debug('==================== getAllOrder ====================');
    Log_1.Log.debug('req query is ', req.query);
    var file = '';
    var selectedStoreID = '';
    var selectedType = '';
    var startDate = 0;
    var endDate = 0;
    if (req.query.file && req.query.file.length > 0) {
        file = req.query.file;
    }
    if (req.query.selectedStoreID && req.query.selectedStoreID.length > 0) {
        selectedStoreID = req.query.selectedStoreID;
    }
    if (req.query.selectedType && req.query.selectedType.length > 0) {
        selectedType = req.query.selectedType;
    }
    if (req.query.startDate && req.query.startDate > 0) {
        startDate = req.query.startDate;
    }
    if (req.query.endDate && req.query.endDate > 0) {
        endDate = req.query.endDate;
    }
    var resultFundsTransactionList = yield FundsTransaction_1.FundsTransaction.getFundsTransactionList(selectedStoreID, selectedType, startDate, endDate);
    let resultData;
    if (file === 'csv') {
        var csvData = yield FundsTransaction_1.FundsTransaction.convertJsonToCsv(resultFundsTransactionList);
        resultData = csvData;
    }
    else {
        resultData = resultFundsTransactionList;
    }
    res.send(resultData);
    res.end();
}));
module.exports = router;
//# sourceMappingURL=FundsTransactionRouter.js.map