"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const storeRouter = require("./StoreRouter");
router.use("/stores", storeRouter);
module.exports = router;
//# sourceMappingURL=index.js.map