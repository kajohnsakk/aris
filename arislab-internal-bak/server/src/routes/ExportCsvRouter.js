"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const ExternalProxy_1 = require("../modules/ExternalProxy");
const router = Express.Router();
router.get('/order', (req, res) => {
    ExternalProxy_1.ExternalProxy.getInstance().sendRequest({
        uri: `http://localhost:1780/api/order/getAllOrder?file=csv&selectedStoreID=${req.query.selectedStoreID}&selectedStatus=${req.query.selectedStatus}&startDate=${req.query.startDate}&endDate=${req.query.endDate}`,
        method: 'get',
    })
        .then((resultOrderCsv) => {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'order-' + Date.now() + '.csv\"');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.write('\ufeff' + resultOrderCsv, 'utf-8');
        res.end();
    });
});
module.exports = router;
//# sourceMappingURL=ExportCsvRouter.js.map