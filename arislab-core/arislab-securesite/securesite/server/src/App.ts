import { Log } from "./utils/Log";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
require("express-ws")(app);

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
app.use("/site", express.static(path.join(__dirname, "..", "..", "public")));

app.use("/site/customer", require("./routes/CustomerRouter"));
app.use("/site/cart", require("./routes/CartRouter"));
app.use("/site/productBooking", require("./routes/ProductBookingRouter"));
app.use("/site/payment", require("./routes/paymentRouter"));
app.use("/site/reports", require("./routes/reportingRouter"));
app.use("/site/link", require("./routes/LinkRouter"));
app.use("/download", require("./routes/downloadRouter"));
app.use("/site/reserveProduct", require("./routes/ReserveProductRouter"));

const port = process.env.SECURESITE_PORT || 1380;
app.listen(port, () => {
  Log.debug("securesite listening on port ", port);
});

module.exports = app;
