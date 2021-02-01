import express from "express";
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import { validationHelper } from "./helpers";
import { mediaServerService } from "./services";
const { ValidationError } = validationHelper;

import routes from "./routes";
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", routes);

mediaServerService.start();

app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

module.exports = app;
