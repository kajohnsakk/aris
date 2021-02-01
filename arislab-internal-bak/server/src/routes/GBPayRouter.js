"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const GBPay_1 = require("../models/GBPay");
const router = Express.Router();
router.post('/verifyToken', (req, res) => {
    let token = req.body.token;
    GBPay_1.GBPay.verifyToken(token)
        .then((resultGenerateGBLink) => {
        res.send(resultGenerateGBLink);
        res.end();
    });
});
module.exports = router;
//# sourceMappingURL=GBPayRouter.js.map