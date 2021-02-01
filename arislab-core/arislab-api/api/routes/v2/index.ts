import * as express from "express";
const router = express.Router();

const storeRouter = require("./StoreRouter");

router.use("/stores", storeRouter);

module.exports = router;
