const express = require("express"),
  cors = require("cors"),
  app = express(),
  log = require("./utils/log"),
  httpProxy = require("http-proxy");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const LoginRouter = require("./src/routes/LoginRouter");
const LogoutRouter = require("./src/routes/LogoutRouter");
const CallbackRouter = require("./src/routes/CallbackRouter");
const ProxyRouter = require("./src/routes/ProxyRouter");
const TokenRouter = require("./src/routes/TokenRouter");
const InviteUserRouter = require("./src/routes/InviteUserRouter");
const ResetPasswordRouter = require("./src/routes/ResetPasswordRouter");

const crypto = require("crypto");
const SECRET = crypto.randomBytes(128).toString("hex");
const constants = require("constants");
const RateLimiter = require("./src/components/RateLimiter").RateLimiter;
import Authentication from "./src/components/Authentication";

const limiter = RateLimiter.getLimiter();

import { UserManager } from "./src/components/UserManager";
import * as AppConfig from "./src/config/AppConfig";

const onRes = function (proxyRes: any, req: any, res: any) {
  proxyRes.headers["x-powered-by"] = process.env.XPOWEREDBY || "ConvoLab";
  proxyRes.headers["X-XSS-Protection"] = process.env.X_XSS_PROTECTION || 1;
  proxyRes.headers["Strict-Transport-Security"] =
    process.env.STRICT_TRANSPORT_SECURITY ||
    "max-age=31536000; includeSubDomains; preload";
  proxyRes.headers["X-Content-Type-Options"] =
    process.env.X_CONTENT_TYPE_OPTIONS || "nosniff";
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use("/public", express.static(path.join(__dirname, "public")));

if (process.env.DOMAIN_ALLOW_ORIGIN) {
  app.use((req: any, res: any, next: any) => {
    res.header("access-control-allow-origin", process.env.DOMAIN_ALLOW_ORIGIN);
    res.header("x-powered-by", process.env.XPOWEREDBY || "ArisLab");
    next();
  });
}

app.use((req: any, res: any, next: any) => {
  res.header("X-XSS-Protection", process.env.X_XSS_PROTECTION || 1);
  res.header(
    "Strict-Transport-Security",
    process.env.STRICT_TRANSPORT_SECURITY ||
      "max-age=31536000; includeSubDomains; preload"
  );
  res.header(
    "X-Content-Type-Options",
    process.env.X_CONTENT_TYPE_OPTIONS || "nosniff"
  );
  next();
});

app.use(cookieParser());

const options = {
  secret: SECRET,
};

const apiConfig = {
  host: process.env.API_HOST || AppConfig.API_HOST,
  port: process.env.API_PORT || AppConfig.API_PORT,
};

const analyticServiceConfig = {
  host: process.env.ANALYTIC_SERVICE_HOST,
  port: process.env.ANALYTIC_SERVICE_PORT,
};

const apiServer = new httpProxy.createProxyServer({
  target: apiConfig,
});

const analyticService = new httpProxy.createProxyServer({
  target: analyticServiceConfig,
});

const platformConfig = {
  host: process.env.PLATFORM_HOST || AppConfig.PLATFORM_HOST,
  port: process.env.PLATFORM_PORT || AppConfig.PLATFORM_PORT,
};
const platformServer = new httpProxy.createProxyServer({
  target: platformConfig,
});

const securesiteConfig = {
  host: process.env.SECURESITE_HOST || AppConfig.SECURESITE_HOST,
  port: process.env.SECURESITE_PORT || AppConfig.SECURESITE_POST,
};
const securesiteServer = new httpProxy.createProxyServer({
  target: securesiteConfig,
});

const consoleConfig = {
  host: process.env.CONSOLE_HOST || "localhost",
  port: process.env.CONSOLE_PORT || 1480,
};
const consoleServer = new httpProxy.createProxyServer({
  target: consoleConfig,
});

const mediaWebConfig = {
  host: process.env.MEDIA_WEB_HOST || AppConfig.MEDIA_WEB_HOST,
  port: process.env.MEDIA_WEB_PORT || AppConfig.MEDIA_WEB_PORT,
};
const mediaWebServer = new httpProxy.createProxyServer({
  target: mediaWebConfig,
});

const mediaConfig = {
  host: process.env.MEDIA_HOST || AppConfig.MEDIA_HOST,
  port: process.env.MEDIA_PORT || AppConfig.MEDIA_PORT,
};
const mediaServer = new httpProxy.createProxyServer({
  target: mediaConfig,
});

const serviceStatusConfig = {
  host: process.env.SERVICE_STATUS_HOST || "localhost",
  port: process.env.SERVICE_STATUS_PORT || "1150",
};

const serviceStatusServer = new httpProxy.createProxyServer({
  target: serviceStatusConfig,
});

const webhookConfig = {
  host: process.env.WEBHOOK_HOST || "localhost",
  port: process.env.WEBHOOK_PORT || "3111",
};

const webhookServer = new httpProxy.createProxyServer({
  target: webhookConfig,
});

const streamStatusConfig = {
  host: process.env.STREAM_STATUS_HOST || "localhost",
  port: process.env.STREAM_STATUS_PORT || "1112",
};

const streamStatusServer = new httpProxy.createProxyServer({
  target: streamStatusConfig,
});

const queueServiceConfig = {
  host: process.env.QUEUESERVICE_HOST || "localhost",
  port: process.env.QUEUESERVICE_PORT || 1415,
};

const queueServiceServer = new httpProxy.createProxyServer({
  target: queueServiceConfig,
});

apiServer.on("proxyRes", onRes);
platformServer.on("proxyRes", onRes);
securesiteServer.on("proxyRes", onRes);
consoleServer.on("proxyRes", onRes);
mediaServer.on("proxyRes", onRes);
mediaWebServer.on("proxyRes", onRes);
queueServiceServer.on("proxyRes", onRes);

log.debug("[RVP] Servers configuration: ");
log.debug("[RVP] API: ", JSON.stringify(apiConfig));
log.debug("[RVP] Platform: ", JSON.stringify(platformConfig));
log.debug("[RVP] Securesite: ", JSON.stringify(securesiteConfig));
log.debug("[RVP] Media: ", JSON.stringify(mediaConfig));
log.debug("[RVP] Media Web: ", JSON.stringify(mediaWebConfig));
log.debug("[RVP] serviceStatusConfig is ", JSON.stringify(serviceStatusConfig));
log.debug("[RVP] webhookConfig is ", JSON.stringify(webhookConfig));
log.debug("[RVP] streamStatusConfig is ", JSON.stringify(streamStatusConfig));
log.debug("[RVP] queueServiceConfig is ", JSON.stringify(queueServiceConfig));

app.all("/live*", function (req: any, res: any) {
  var forwardIP = req.query.ip;
  if (forwardIP && forwardIP.length > 0) {
    var forwardPort = process.env.MEDIA_PORT || AppConfig.MEDIA_PORT;
    mediaServer.web(req, res, { target: `http://${forwardIP}:${forwardPort}` });
  } else {
    mediaServer.web(req, res);
  }
});

app.all("/stream*", function (req: any, res: any) {
  streamStatusServer.web(req, res);
});

app.all("/events*", function (req: any, res: any) {
  var forwardIP = req.query.ip;
  if (forwardIP && forwardIP.length > 0) {
    var forwardPort = process.env.MEDIA_WEB_PORT || AppConfig.MEDIA_WEB_PORT;
    mediaWebServer.web(req, res, {
      target: `http://${forwardIP}:${forwardPort}`,
    });
  }

  mediaWebServer.web(req, res);
});

app.all("/api/files", function (req: any, res: any) {
  apiServer.web(req, res);
});

app.all("/api/v1/analytics*", function (req: any, res: any) {
  if (req.cookies.token && req.cookies.isManualLogin) {
    const auth = new Authentication(req.cookies.token);
    const isVerified = auth.verify();
    if (isVerified) {
      analyticService.web(req, res);
      return;
    }
  }

  if (!UserManager.getTokenInfo(req.cookies.token)) {
    log.debug(
      "incoming request to /api but not logged in, redirecting to login page"
    );
    res.redirect("/login");
  } else {
    analyticService.web(req, res);
  }
});

app.all("/api*", function (req: any, res: any) {
  if (req.cookies.token && req.cookies.isManualLogin) {
    const auth = new Authentication(req.cookies.token);
    const isVerified = auth.verify();
    if (isVerified) {
      apiServer.web(req, res);
      return;
    }
  }

  if (!UserManager.getTokenInfo(req.cookies.token)) {
    log.debug(
      "incoming request to /api but not logged in, redirecting to login page"
    );
    res.redirect("/login");
  } else {
    apiServer.web(req, res);
  }
});

app.all("/download*", cors(), function (req: any, res: any) {
  securesiteServer.web(req, res);
});

app.all("/site*", cors(), function (req: any, res: any) {
  securesiteServer.web(req, res);
});

app.all("/console*", function (req: any, res: any) {
  log.debug("redirecting to console server");
  consoleServer.web(req, res);
});

app.all("/status*", cors(), (req: any, res: any) => {
  serviceStatusServer.web(req, res);
});

app.all("/webhook*", cors(), (req: any, res: any) => {
  log.debug("forwarding new request to webhook service with body: ", req.body);
  webhookServer.web(req, res);
});

app.all("/queue*", (req: any, res: any) => {
  if (!UserManager.getTokenInfo(req.cookies.token)) {
    log.debug(
      "incoming request to /queue but not logged in, redirecting to login page"
    );
    res.redirect("/login");
  } else {
    log.debug("forwarding new request to queue service with body: ", req.body);
    queueServiceServer.web(req, res);
  }
});

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());

app.use("/proxy", ProxyRouter);
app.use("/login", limiter, LoginRouter);
app.use("/login", express.static("./"));
app.use("/logout", LogoutRouter);
app.use("/logout", express.static(path.join(__dirname, "public")));
app.use("/token", TokenRouter);
app.use("/callback", CallbackRouter);
app.use("/invite", limiter, InviteUserRouter);
app.use("/reset-password", limiter, ResetPasswordRouter);

var IS_VERIFIED = false;
var USER_INFO = {};

app.all("/platform*", async function (req: any, res: any) {
  if (req.cookies.token && req.cookies.isManualLogin) {
    const auth = new Authentication(req.cookies.token);
    const isVerified = auth.verify();
    if (isVerified) {
      platformServer.web(req, res);
      return;
    }
  }

  if (!UserManager.getTokenInfo(req.cookies.token)) {
    log.debug(
      "incoming request to /platform but not logged in, redirecting to login page"
    );
    res.redirect("/login");
  } else if (
    !IS_VERIFIED ||
    USER_INFO !== UserManager.getTokenInfo(req.cookies.token)
  ) {
    USER_INFO = UserManager.getTokenInfo(req.cookies.token);
    IS_VERIFIED = await UserManager.getUserVerifyStatus(req.cookies.token);

    if (IS_VERIFIED) {
      platformServer.web(req, res);
    } else {
      res.redirect("/");
    }
  } else {
    platformServer.web(req, res);
  }
});

app.all("*", function (req: any, res: any) {
  let cookiesList = [
    "auth0_uid",
    "token",
    "isLoggedIn",
    "email",
    "isManualLogin",
  ];

  cookiesList.forEach((cookie) => {
    res.clearCookie(cookie);
  });

  if (req.cookies.token && req.cookies.isManualLogin) {
    const auth = new Authentication(req.cookies.token);
    const isVerified = auth.verify();
    if (isVerified) {
      platformServer.web(req, res);
      return;
    }
  }

  if (!UserManager.getTokenInfo(req.cookies.token)) {
    log.debug(
      "incoming request to /platform but not logged in, redirecting to login page"
    );
    res.redirect("/login");
  } else {
    platformServer.web(req, res);
  }
});

const port = process.env.RVP_PORT || AppConfig.RVP_PORT;
const server = require("http").createServer(app);
server.on("upgrade", function (req: any, socket: any, head: any) {
  log.debug("received upgrade request for ", req.url);
  if (req.url.indexOf("/api") == 0) {
    log.debug("redirecting to api server");
    apiServer.ws(req, socket, head);
  } else if (req.url.indexOf("/site") == 0) {
    log.debug("redirecting to securesite server");
    securesiteServer.ws(req, socket, head);
  } else if (req.url.indexOf("/console") == 0) {
    log.debug("redirecting to console server");
    consoleServer.ws(req, socket, head);
  }
});

const sslModeString = process.env.SSL_OPTIONS;
const secureOptions = sslModeString
  ? sslModeString.split(",").reduce((accum, currentValue) => {
      return accum | constants[currentValue.trim()];
    }, 0)
  : undefined;

const portHttps = process.env.RVP_PORT_TLS || AppConfig.RVP_PORT_TLS;
const ssl_cert_env =
  process.env.SSL_CUSTOM_CERT || "sslcert/STAR_convolab_ai_bundle.crt";
const ssl_pem_env =
  process.env.SSL_CUSTOM_PEM || "sslcert/STAR_convolab_ai.key";

const serverOptions = {
  cert: fs.readFileSync(path.resolve(__dirname, ssl_cert_env), "utf8"),
  key: fs.readFileSync(path.resolve(__dirname, ssl_pem_env), "utf8"),
  requestCert: true,
  rejectUnauthorized: false,
  secureOptions: secureOptions,
};

log.debug("starting https server with ssl mode " + sslModeString);
const secureServer = require("https").createServer(serverOptions, app);
secureServer.on("upgrade", function (req: any, socket: any, head: any) {
  if (req.url.indexOf("/api") == 0) {
    apiServer.ws(req, socket, head);
  } else if (req.url.indexOf("/site") == 0) {
    log.debug("redirecting to securesite server");
    securesiteServer.ws(req, socket, head);
  } else if (req.url.indexOf("/console") == 0) {
    log.debug("redirecting to console server");
    consoleServer.ws(req, socket, head);
  }
});

process.on("uncaughtException", function (err: any) {
  log.error("error thrown ", err.stack);
});
server.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  log.debug("RVP ready, listening at " + port);
});

secureServer.listen(portHttps, function () {
  const host = secureServer.address().address;
  const portHttps = secureServer.address().port;
  log.debug("RVP HTTPS ready, listening at " + portHttps);
});
