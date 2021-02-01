import { Response, Request } from "express";
import { Job, DoneCallback } from "kue";
import { Log } from './utils/Log';

const kue = require("kue");
const express = require("express");
const app = express();
const servicePort = process.env.QUEUESERVICE_PORT || 1415;
const path = require('path');

const FundsTransactionRouter = require('./routes/FundsTransactionRouter');

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use("/queue/dashboard/", kue.app);

app.use('/queue/fundsTransaction', FundsTransactionRouter);

const server = app.listen(servicePort, function () {
	Log.debug('Queue service ready on port ' + servicePort);
});