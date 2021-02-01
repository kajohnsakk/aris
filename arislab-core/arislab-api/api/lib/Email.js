"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class Email {
    constructor(config) {
        this.config = config;
        this.transporter = this.getTransporter(config.type, config.config);
    }
    getTransporter(type, config) {
        switch (type) {
            case "gmail":
                return this.gmailTransporter(config);
            default:
                return this.defaultTransporter(config);
        }
    }
    defaultTransporter(config) {
        let transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });
        return transporter;
    }
    gmailTransporter(config) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: config.type,
                user: config.user,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                refreshToken: config.refreshToken,
            },
        });
        return transporter;
    }
    send(options) {
        return this.transporter.sendMail({
            from: options.sender,
            to: options.receiver,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}
exports.default = Email;
//# sourceMappingURL=Email.js.map