const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const busboy = require("connect-busboy");
const fs = require("fs");
const path = require("path");
const log = require("./utils/log");
const { ValidationError } = require("express-validation");

const BusinessProfileRouter = require("./routes/BusinessProfileRouter");
const PaymentRouter = require("./routes/PaymentRouter");
const GBPayRouter = require("./routes/GBPayRouter");
const PolicyRouter = require("./routes/PolicyRouter");
const DeliveryRouter = require("./routes/DeliveryRouter");
const StoreConfigRouter = require("./routes/StoreConfigRouter");
const ProductRouter = require("./routes/ProductRouter");
const OrderRouter = require("./routes/OrderRouter");
const FileRouter = require("./routes/FileRouter");
const UtilityRouter = require("./routes/UtilityRouter");
const ChannelRouter = require("./routes/ChannelRouter");
const EventRouter = require("./routes/EventRouter");
const ChatbotRouter = require("./routes/ChatbotRouter");
const ReportingRouter = require("./routes/ReportingRouter");
const EmailRouter = require("./routes/EmailRouter");
const SmsRouter = require("./routes/SmsRouter");
const OtpRouter = require("./routes/OtpRouter");
const BankRecordRouter = require("./routes/BankRecordRouter");
const FundsTransactionRouter = require("./routes/FundsTransactionRouter");
const CartRouter = require("./routes/CartRouter");
const CustomerRouter = require("./routes/CustomerRouter");
const ProductBookingRouter = require("./routes/ProductBookingRouter");
const GBPayAccountRouter = require("./routes/GBPayAccountRouter");
const EventTransactionRouter = require("./routes/EventTransactionRouter");
const StorePackageRouter = require("./routes/StorePackageRouter");
const CreditCardRouter = require("./routes/CreditCardRouter");
const RecurringRouter = require("./routes/RecurringRouter");
const RecurringTransactionRouter = require("./routes/RecurringTransactionRouter");
const InvoiceRouter = require("./routes/InvoiceRouter");
const ReserveProductRouter = require("./routes/ReserveProductRouter");
const VoteCustomerRouter = require("./routes/VoteCustomerRouter");
const StoreSettingRouter = require("./routes/StoreSettingRouter");
const UserRouter = require("./routes/UserRouter");
const AuthRouter = require("./routes/AuthRouter");
const ControlpanelRouter = require("./routes/ControlpanelRouter");
const v2Router = require("./routes/v2");

app.use(compression());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "500mb" }));
app.use(busboy());

app.use(cookieParser());
app.use(function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cache-Control"
  );
  next();
});

app.use("/api/businessProfile", BusinessProfileRouter);
app.use("/api/store", StoreSettingRouter);
app.use("/api/payment", PaymentRouter);
app.use("/api/gbpay", GBPayRouter);
app.use("/api/policy", PolicyRouter);
app.use("/api/delivery", DeliveryRouter);
app.use("/api/storeConfig", StoreConfigRouter);
app.use("/api/product", ProductRouter);
app.use("/api/order", OrderRouter);
app.use("/api/utility", UtilityRouter);
app.use("/api/channels", ChannelRouter);
app.use("/api/event", EventRouter);
app.use("/api/chatbot", ChatbotRouter);
app.use("/api/reports", ReportingRouter);
app.use("/api/email", EmailRouter);
app.use("/api/sms", SmsRouter);
app.use("/api/otp", OtpRouter);
app.use("/api/bankRecord", BankRecordRouter);
app.use("/api/fundsTransaction", FundsTransactionRouter);
app.use("/api/cart", CartRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/productBooking", ProductBookingRouter);
app.use("/api/gbpayAccount", GBPayAccountRouter);
app.use("/api/eventTransaction", EventTransactionRouter);
app.use("/api/storePackage", StorePackageRouter);
app.use("/api/creditCard", CreditCardRouter);
app.use("/api/recurring", RecurringRouter);
app.use("/api/recurringTransaction", RecurringTransactionRouter);
app.use("/api/invoice", InvoiceRouter);
app.use("/api/reserveProduct", ReserveProductRouter);
app.use("/api/votecustomer", VoteCustomerRouter);
app.use("/api/users", UserRouter);
app.use("/api/login", AuthRouter);
app.use("/api/controlpanel", ControlpanelRouter);
app.use("/api/v2", v2Router);

app.use("/api/files", FileRouter);

app.use(function (
  error: { statusCode: any },
  req: any,
  res: {
    status: (
      arg0: number
    ) => { (): any; new (): any; json: { (arg0: any): any; new (): any } };
  },
  next: any
) {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error);
  }

  return res.status(500).json(error);
});

const server = app.listen(process.env.API_PORT || 1780, function () {
  const host = server.address().address;
  const port = server.address().port;
  log.debug("Listening at http://%s:%s", host, port);
});
