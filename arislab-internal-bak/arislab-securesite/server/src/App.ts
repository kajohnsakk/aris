import { Log } from "./utils/Log";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
require("express-ws")(app);
// require('dotenv').config({
//     path: '../../../.env'
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
//set access control allow origin
if (process.env.DOMAIN_ALLOW_ORIGIN) {
  app.use((req: any, res: any, next: any) => {
    res.header("access-control-allow-origin", process.env.DOMAIN_ALLOW_ORIGIN);
    next();
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "..", "..", "public")));

app.use("/export/csv", require("./routes/ExportCsvRouter"));
app.use("/login", require("./routes/Auth"));
app.use("/", require("./routes/ViewRouter"));

const port = process.env.SECURESITE_PORT || 1380;
app.listen(port, () => {
  Log.debug("securesite listening on port ", port);
});

module.exports = app;
