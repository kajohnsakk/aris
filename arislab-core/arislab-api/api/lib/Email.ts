const nodemailer = require("nodemailer");

interface IEmailConfig {
  type: string;
  config: any;
}

interface IDefaultTransporter {
  host: string;
  user: string;
  password: string;
  port: number;
  secure: boolean;
}

interface IGmailTransporter {
  type: string;
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface IEmail {
  sender: string;
  receiver: string;
  subject: string;
  text: string;
  html?: string;
}

export default class Email {
  transporter: any;
  config: IEmailConfig;

  constructor(config: IEmailConfig) {
    this.config = config;
    this.transporter = this.getTransporter(config.type, config.config);
  }

  getTransporter(type: string, config: any) {
    switch (type) {
      case "gmail":
        return this.gmailTransporter(config);
      default:
        return this.defaultTransporter(config);
    }
  }

  defaultTransporter(config: IDefaultTransporter) {
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

  gmailTransporter(config: IGmailTransporter) {
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

  send(options: IEmail) {
    return this.transporter.sendMail({
      from: options.sender,
      to: options.receiver,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
