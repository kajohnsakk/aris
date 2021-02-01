/**
 * Created by touchaponk on 25/10/2015.
 */
const express = require('express'),
    cors = require('cors'),
    app = express(),
    log = require("./utils/log"),
    helper = require("./utils/helper"),
    httpProxy = require('http-proxy');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ProxyRouter = require('./src/routes/ProxyRouter');
const constants = require('constants');
const RateLimiter = require('./src/components/RateLimiter').RateLimiter;

const xFrameSameOrigin = require('x-frame-options')('SAMEORIGIN');

const limiter = RateLimiter.getLimiter();

import { Log } from './src/utils/Log';

const onRes = function (proxyRes: any, req: any, res: any) {
    proxyRes.headers['x-powered-by'] = process.env.XPOWEREDBY || 'ConvoLab';
    // if (process.env.USE_SECURITY_HEADERS) {
    proxyRes.headers['X-XSS-Protection'] = process.env.X_XSS_PROTECTION || 1;
    // proxyRes.headers['X-Frame-Options'] = process.env.X_FRAME_OPTIONS || "SAMEORIGIN";
    proxyRes.headers['Strict-Transport-Security'] = process.env.STRICT_TRANSPORT_SECURITY || "max-age=31536000; includeSubDomains; preload";
    // proxyRes.headers['Content-Security-Policy'] = process.env.CONTENT_SECURITY_POLICY || `default-src 'self' https://maps.googleapis.com/maps/api/js https://fonts.gstatic.com/s/roboto/ https://connect.facebook.net/ 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline'`;
    proxyRes.headers['X-Content-Type-Options'] = process.env.X_CONTENT_TYPE_OPTIONS || "nosniff";
    // }
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use('/static', express.static(path.join(__dirname, '../../arislab-homepage/build/static')));
// app.use('/css', express.static(path.join(__dirname, '../../arislab-homepage')));

if (process.env.DOMAIN_ALLOW_ORIGIN) {
    app.use((req: any, res: any, next: any) => {
        res.header('access-control-allow-origin', process.env.DOMAIN_ALLOW_ORIGIN);
        // res.header('access-control-allow-origin', 'https://arislab.auth0.com');
        // res.header('access-control-allow-origin', 'https://auth0.com');
        res.header('x-powered-by', process.env.XPOWEREDBY || 'ArisLab');
        next();
    });
}


// if (process.env.USE_SECURITY_HEADERS) {
app.use((req: any, res: any, next: any) => {
    res.header('X-XSS-Protection', process.env.X_XSS_PROTECTION || 1);
    // res.header('X-Frame-Options', process.env.X_FRAME_OPTIONS || "SAMEORIGIN");
    res.header('Strict-Transport-Security', process.env.STRICT_TRANSPORT_SECURITY || "max-age=31536000; includeSubDomains; preload");
    // res.header('Content-Security-Policy', process.env.CONTENT_SECURITY_POLICY || `default-src 'self' https://maps.googleapis.com/maps/api/js https://fonts.gstatic.com/s/roboto/ https://connect.facebook.net/ 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline'`);
    res.header('X-Content-Type-Options', process.env.X_CONTENT_TYPE_OPTIONS || "nosniff");
    // res.header('X-Content-Type-Options', "text/html");
    // res.header('Access-Control-Allow-Credentials', true);
    next();
});
// }
app.use(cookieParser());
// app.use(cors({
//     origin: process.env.WEB_URL,
//     credentials: true
// }));
// app.use(xFrameOptions('SAMEORIGIN'));

const apiConfig = {
    host: process.env.API_HOST,
    port: process.env.API_PORT
};
const apiServer = new httpProxy.createProxyServer({
    target: apiConfig
});

const securesiteConfig = {
    host: process.env.SECURESITE_HOST,
    port: process.env.SECURESITE_PORT
};
const securesiteServer = new httpProxy.createProxyServer({
    target: securesiteConfig
});

apiServer.on('proxyRes', onRes);
securesiteServer.on('proxyRes', onRes);

log.debug("[RVP] Servers configuration: ");
// log.debug("[RVP] API: ", JSON.stringify(apiConfig));
log.debug("[RVP] Securesite: ", JSON.stringify(securesiteConfig));

app.all("/api*", function (req: any, res: any) {
    log.debug('redirecting to api server')
    apiServer.web(req, res);
});

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

app.use("/proxy", ProxyRouter);

// app.all("/", function (req: any, res: any) {
//     res.redirect("/site");
// });

app.all("*", function (req: any, res: any) {
    log.debug('redirecting to securesite service')
    securesiteServer.web(req, res);
});

//http
const port = process.env.RVP_PORT;
const server = require('http').createServer(app);
server.on('upgrade', function (req: any, socket: any, head: any) {
    log.debug("received upgrade request for ", req.url);
    if (req.url.indexOf("/api") == 0) {
        log.debug('redirecting to api server');
        apiServer.ws(req, socket, head);
    }
});

const sslModeString = process.env.SSL_OPTIONS;
const secureOptions = sslModeString ? sslModeString.split(',').reduce((accum, currentValue) => {
    return accum | constants[currentValue.trim()];
}, 0) : undefined;

//https
const portHttps = process.env.RVP_PORT_TLS;
const ssl_cert_env = process.env.SSL_CUSTOM_CERT || "sslcert/STAR_convolab_ai_bundle.crt";
const ssl_pem_env = process.env.SSL_CUSTOM_PEM || "sslcert/STAR_convolab_ai.key";
// const ssl_pem_ca = process.env.SSL_CUSTOM_INTERMEDIATE || "sslcert/convolab_intermediate.crt";

const serverOptions = {
    cert: fs.readFileSync(path.resolve(__dirname, ssl_cert_env), "utf8"),
    key: fs.readFileSync(path.resolve(__dirname, ssl_pem_env), "utf8"),
    requestCert: true,
    rejectUnauthorized: false,
    secureOptions: secureOptions
};

log.debug("starting https server with ssl mode " + sslModeString);
const secureServer = require('https').createServer(serverOptions, app);
secureServer.on('upgrade', function (req: any, socket: any, head: any) {
    log.debug("received upgrade request for ", req.url);
    // if (req.url.indexOf("/api") == 0) {
    //     apiServer.ws(req, socket, head);
    // }
    securesiteServer.web(req, socket, head);
});

process.on('uncaughtException', function (err: any) {
    // handle the error safely
    log.error("error thrown ", err.stack);
});
// server.listen(port);
// log.info("[RVP] RVP ready, listening at "+(port));
server.listen(port, function () {
    const host = server.address().address;
    const port = server.address().port;
    log.debug("RVP ready, listening at " + (port));
    //log.info("RVP w/ env ", process.env);
});

secureServer.listen(portHttps, function () {
    const host = secureServer.address().address;
    const portHttps = secureServer.address().port;
    log.debug("RVP HTTPS ready, listening at " + (portHttps));
});