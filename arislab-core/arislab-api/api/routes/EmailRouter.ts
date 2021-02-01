export {};
import * as express from "express";
import { Request, Response } from "express";
import { Log } from "../ts-utils/Log";

const router = express.Router();

const nodemailer = require("nodemailer");

router.post("/send", (req: Request, res: Response) => {
  let to = req.body.to;
  let from = req.body.from;
  let subject = req.body.subject;
  let text = req.body.text;

  const auth = {
    type: "oauth2",
    user: "admin@arislab.ai",
    clientId:
      "141545873118-u6vs7jt7bpl8nko9h9ln5s2qm0rkr909.apps.googleusercontent.com",
    clientSecret: "azE9E650HTjadEKJG9tfYpoJ",
    refreshToken:
      "1//04xHmS5fUC7k7CgYIARAAGAQSNwF-L9IrsTa_ZoLqbF81w77imJ9HiDYVK7ppN9lgBHqaDlbJ365WBf_Qc7anhotE5hI5lSRIScw",
  };

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: auth,
  });

  transporter.sendMail(mailOptions, (err: any, res: any) => {
    if (err) {
      Log.error("Error while sending mail : ", err);
      throw err;
    } else {
      Log.debug("Send email successfully with options : ", mailOptions);
      Log.debug("Result from sent email is: ", res);
      res.send(mailOptions);
      res.end();
    }
  });
});

module.exports = router;
