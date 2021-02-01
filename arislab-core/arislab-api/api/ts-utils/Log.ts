const stackTrace = require('stack-trace');
const winston = require('winston');
const util = require('util');
const path = require('path');

const transports = [];

//expose log to transport by process.env.LOG_DESTINATION
if (process.env.LOG_DESTINATION == "rapid7" || !process.env.LOG_DESTINATION) {
    require('r7insight_node');
    const insightOpsTransport = new winston.transports.Logentries({
        token: (process.env.RAPID7_LOG_TOKEN) ? process.env.RAPID7_LOG_TOKEN : '69cbaa4d-8ce4-48e7-afe2-eee75158d2e6',
        region: 'au'
    });
    
    console.log("using rapid7 log")
    transports.push(insightOpsTransport);
}
else if (process.env.LOG_DESTINATION == "loggly") {
    require('winston-loggly-bulk');
    const logglyTransport = new winston.transports.Loggly({
        inputToken: "e6e8fb28-2c2c-4459-9b8a-932ecac8e33a",
        subdomain: "convo01",
        tags: [process.env.nuser, "api"],
        level: process.env.log,
        json: true
    });

    console.log("using loggly log");
    transports.push(logglyTransport);
}
else if (process.env.LOG_DESTINATION == "papertrail") {
    require('winston-papertrail').Papertrail;
    const papertrailTransport = new winston.transports.Papertrail({
        host: 'logs3.papertrailapp.com',
        port: 39255,
        handleExceptions: false,
        humanReadableUnhandledException: false,
        program: process.env.nuser + "-API",
        level: process.env.log,
        colorize: false
    });

    console.log("using papertrail log");
    transports.push(papertrailTransport);
}
else if (process.env.LOG_DESTINATION == "logentries") {
    require('le_node');
    const logEntryTransport = new winston.transports.Logentries({
        withHostname: process.env.nuser + "-API",
        token: "b002d83a-bc84-4cd3-adf1-bf48c96a1b42"
    });

    transports.push(logEntryTransport);
    console.log("using logentries log");
}
else if (process.env.LOG_DESTINATION && process.env.LOG_DESTINATION.indexOf(":") > 0) {
    require('winston-logstash');
    const elkr = process.env.LOG_DESTINATION.split(":");
    const logstashTransport = new winston.transports.Logstash({
        level: process.env.log,
        node_name: process.env.nuser + "-API",
        host: elkr[0],
        port: Number(elkr[1])
    });

    console.log("logging to " + elkr[0] + ":" + Number(elkr[1]));
    transports.push(logstashTransport)
}
else {
    require('winston-daily-rotate-file');
    const fileRotationTransport = new (winston.transports.DailyRotateFile)({
        handleExceptions: false,
        humanReadableUnhandledException: false,
        level: process.env.log,
        datePattern: 'YYYY-MM-DD',
        timestamp: () => {
            return new Date().toLocaleString();
        },
        formatter: (options: any) => {
            return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
        },
        filename: path.join(process.env.LOG_FOLDER, 'api-%DATE%.log'),
        maxSize: (process.env.LOG_MAX_SIZE) ? process.env.LOG_MAX_SIZE : '50m',
    });

    console.log("LOG_DESTINATION is not configured: " + process.env.LOG_DESTINATION + " , logging to files only");
    transports.push(fileRotationTransport)
}

//expose console log by default
const consoleTransport = new (winston.transports.Console)({
    handleExceptions: false,
    humanReadableUnhandledException: false,
    level: process.env.log,
    timestamp: () => {
        const now = new Date();
        return now.toLocaleString() + "-" + now.getMilliseconds();
    },
    formatter: (options: any) => {
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
    }
});
console.log("using console log");
transports.push(consoleTransport);

const logger = new winston.Logger({ transports: transports });
export class Log {
    public static handleRejection() {
        process.on('unhandledRejection', (error, p) => {
            Log.error('Unhandled Rejection with reason:' + (process.env.HIDE_LOG_STACK ? error : (error)));
            // Log.error('Unhandled Rejection with reason:'+ (process.env.HIDE_LOG_STACK ? error : (error.stack || error)));
            // application specific logging, throwing an error, or other logic here
        });
        process.on('uncaughtException', (error) => {
            Log.error('Unhandled Exception with reason:' + (process.env.HIDE_LOG_STACK ? error : (error.stack || error)));
            // application specific logging, throwing an error, or other logic here
        });
    }
    public static debug(...args: any[]) {
        var msg = ""
        for (var i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "object") msg += util.inspect(arguments[i], {
                depth: null
            });
            else msg += arguments[i];
        }
        var c = 0;
        var stacks = stackTrace.get();
        var ststr = "";
        if (!process.env.HIDE_LOG_STACK) for (let i in stacks) {
            // if(count > 2)break;
            var st = stacks[i];
            var fname = st.getFileName();
            if (!fname) continue;
            fname = fname.replace(/\\/g, "/");
            // console.log("fname is "+fname+"\n");
            if (fname.indexOf("node_modules") < 0
                && (fname.indexOf("native code") < 0) && (fname.indexOf("Log.js") < 0)) {
                var t = fname.substring(fname.lastIndexOf("/")) + ":" + st.getLineNumber();
                ststr = t + ">" + ststr;
                // console.log("Adding "+t);
                if (++c >= 3) break;
            }
        }
        ststr = "[" + ststr + "] ";
        var msg = ststr + msg.replace(/\n/g, "\n" + ststr + "\t");
        logger.debug(msg);
    }
    public static error(...args: any[]) {
        var msg = ""
        for (var i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "object") msg += JSON.stringify(arguments[i], null, 4);
            else msg += arguments[i];
        }
        var c = 0;
        var stacks = stackTrace.get();
        var ststr = "";
        if (!process.env.HIDE_LOG_STACK) for (let i in stacks) {
            // if(count > 2)break;
            var st = stacks[i];
            var fname = st.getFileName();
            if (!fname) continue;
            fname = fname.replace(/\\/g, "/");
            // console.log("fname is "+fname+"\n");
            if (fname.indexOf("node_modules") < 0
                && (fname.indexOf("native code") < 0) && (fname.indexOf("Log.js") < 0)) {
                var t = fname.substring(fname.lastIndexOf("/")) + ":" + st.getLineNumber();
                ststr = t + ">" + ststr;
                // console.log("Adding "+t);
                if (++c >= 3) break;
            }
        }
        ststr = "[" + ststr + "] ";
        var msg = ststr + msg.replace(/\n/g, "\n" + ststr + "\t");
        logger.error(msg);
    }
    public static info(...args: any[]) {
        var msg = ""
        for (var i = 0; i < arguments.length; i++) {
            if (typeof (arguments[i]) == "object") msg += JSON.stringify(arguments[i], null, 4);
            else msg += arguments[i];
        }
        var c = 0;
        var stacks = stackTrace.get();
        var ststr = "";
        if (!process.env.HIDE_LOG_STACK) for (let i in stacks) {
            // if(count > 2)break;
            var st = stacks[i];

            var fname = st.getFileName();
            if (!fname) continue;
            fname = fname.replace(/\\/g, "/");
            // console.log("fname is "+fname+"\n");
            if (fname.indexOf("node_modules") < 0
                && (fname.indexOf("native code") < 0) && (fname.indexOf("Log.js") < 0)) {
                var t = fname.substring(fname.lastIndexOf("/")) + ":" + st.getLineNumber();
                ststr = t + ">" + ststr;
                // console.log("Adding "+t);
                if (++c >= 3) break;
            }
        }
        ststr = "[" + ststr + "] ";
        var msg = ststr + msg.replace(/\n/g, "\n" + ststr + "\t");
        logger.info(msg);
    }
};
Log.handleRejection();