const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const busboy = require('connect-busboy');
const fs = require('fs');
const path = require('path');
const { Log } = require("./utils/Log");
// require('dotenv').config({
//     path: '../../.env'
// });


app.use(compression());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
app.use(busboy());

app.use(cookieParser());
app.use(function (req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.use('/api', require('./routes/ServiceRouter'));
app.use('/api/product', require('./routes/ProductRouter'));
app.use('/api/fundsTransaction', require('./routes/FundsTransactionRouter'));
app.use('/api/order', require('./routes/OrderRouter'));
app.use('/api/store', require('./routes/StoreRouter'));
app.use('/api/gbpayAccount', require('./routes/GBPayAccountRouter'));
app.use('/api/otp', require('./routes/OTPRouter'));
app.use('/api/invoice', require('./routes/InvoiceRouter'));

const server = app.listen(process.env.API_PORT || 1780, function () {
    const host = server.address().address;
    const port = server.address().port;
    Log.debug('Listening at http://%s:%s', host, port);
    // Log.debug('api env is ', process.env);
});