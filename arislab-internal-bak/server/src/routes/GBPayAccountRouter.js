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
const express = require("express");
const GBPayAccount_1 = require("../models/GBPayAccount");
const StoreManager_1 = require("../models/StoreManager");
const ErrorObject_1 = require("../utils/ErrorObject");
const Log_1 = require("../utils/Log");
const router = express.Router();
const timeUuid = require('time-uuid');
router.post('/new', (req, res) => {
    const id = timeUuid();
    let updateData;
    let requestBody = req.body;
    requestBody['id'] = id;
    updateData = Object.assign({}, requestBody);
    Log_1.Log.debug('[GBPayAccountRouter] Creating new gbpay account with body: ', updateData);
    const updateObj = new GBPayAccount_1.GBPayAccount(updateData, id);
    res.send({ "_id": updateObj.getUuid() });
    res.end();
    return updateObj.update(updateData);
});
router.post('/update', (req, res) => {
    const id = req.query.id;
    let updateData;
    let requestBody = req.body;
    requestBody['id'] = id;
    updateData = Object.assign({}, requestBody);
    Log_1.Log.debug('[GBPayAccountRouter] Updating id ' + id + ' with body: ', updateData);
    res.sendStatus(200);
    res.end();
    const updateObj = new GBPayAccount_1.GBPayAccount(updateData, id);
    return updateObj.save();
});
router.get("/details", (req, res) => {
    const id = req.query.id;
    if (!id) {
        throw new ErrorObject_1.ErrorObject("id is required", 400);
    }
    else {
        GBPayAccount_1.GBPayAccount.findById(id).then(resultFindByID => {
            res.send(resultFindByID);
            res.end();
        });
    }
});
router.get("/all", (req, res) => {
    GBPayAccount_1.GBPayAccount.findAll().then(resultFindAll => {
        res.send(resultFindAll);
        res.end();
    });
});
router.post('/findByCustomFields', (req, res) => {
    let fieldList = req.body;
    if (!fieldList) {
        ErrorObject_1.ErrorObject.BAD_REQUEST.send(res);
    }
    else {
        GBPayAccount_1.GBPayAccount.findByCustomFields(fieldList)
            .then((resultFindByCustomFields) => {
            res.send(resultFindByCustomFields);
            res.end();
        });
    }
});
router.get('/loadAllToken', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const tokenObj = yield StoreManager_1.StoreManager.retrieveTokenList();
        const tokenList = tokenObj.map((token) => {
            return token['key'];
        });
        const resultPushStoreToken = yield GBPayAccount_1.GBPayAccount.pushStoreToken(tokenList);
        res.send(resultPushStoreToken);
        res.end();
    }
    catch (error) {
        res.send(error);
    }
}));
module.exports = router;
//# sourceMappingURL=GBPayAccountRouter.js.map