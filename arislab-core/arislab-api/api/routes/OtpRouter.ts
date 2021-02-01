import { Otp, JSONData } from "../models/Otp";
import { Log } from "../ts-utils/Log";
import * as express from "express";
import { Request, Response } from "express";
import Store from "../models/StoreV2";

import OTP from "../lib/OTP";
import Email from "../lib/Email";
import JWT from "../lib/JWT";

import OTPEmailTemplate from "../utils/otp-email-template";
import { response } from "../helpers";

const router = express.Router();
const timeUuid = require("time-uuid");

const { validate, Joi } = require("express-validation");

const {
  JWT_SECRET_KEY,
  EMAI_USER,
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  EMAIL_REFRESH_TOKEN,
} = process.env;

const EMAIL_CONFIG = {
  type: "oauth2",
  user: EMAI_USER,
  clientId: EMAIL_CLIENT_ID,
  clientSecret: EMAIL_CLIENT_SECRET,
  refreshToken: EMAIL_REFRESH_TOKEN,
};

const sendOTPShema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    storeID: Joi.string().required(),
  }),
};

const verifyOTPShema = {
  body: Joi.object({
    otp: Joi.number().required(),
    storeID: Joi.string().required(),
  }),
};

router.post(
  "/send",
  validate(sendOTPShema, {}, {}),
  async (req: Request, res: Response) => {
    try {
      const { body } = req;

      Log.debug(`Sending OTP to ${body.email} by storeID ${body.storeID}`);

      Log.debug(`Generating OTP`);
      const otp = new OTP();
      const OTPNumber = otp.generateOTP();
      Log.debug("OTP was generated ", OTPNumber);

      Log.debug(`Generating OTPToken`);
      const jwt = new JWT(JWT_SECRET_KEY);
      const token = jwt.sign(
        {
          otp: OTPNumber,
        },
        {
          expiresIn: "5m",
        }
      );
      Log.debug("Token was generated ", token);

      Log.debug("Finding and update store");
      const store = new Store();
      await store.updateStoreByID(body.storeID, {
        storeInfo: {
          otpToken: token,
        },
      });
      Log.debug("Store was updated");

      const mailOptions = {
        sender: "Arislab <noreply@arislab.ai>",
        receiver: body.email,
        subject: `Aris Verification Code`,
        text: "",
        html: OTPEmailTemplate({
          OTPNumber: OTPNumber.toString(),
        }),
      };

      const email = new Email({ type: "gmail", config: EMAIL_CONFIG });
      const mailInfo = await email.send(mailOptions);

      Log.debug("OTP has been sent ", mailInfo);

      response(res, 200, "OTP has been sent");
    } catch (error) {
      Log.debug("Could not send OTP ", error);
      response(res, 400, error.message);
    }
  }
);

router.post(
  "/verify",
  validate(verifyOTPShema, {}, {}),
  async (req: Request, res: Response) => {
    try {
      const { body } = req;

      Log.debug(`Verifying OTP ${body.otp} by storeID ${body.storeID}`);

      Log.debug(`Finding store`);
      const store = new Store();
      const storeResponse = await store.findStoreByIDs(body.storeID);
      if (storeResponse.hits.total === 0) {
        Log.debug("Store not found");
        response(res, 400, "Store not found");
        return;
      }

      Log.debug("Found store");
      const storeInfo = storeResponse.hits.hits[0]._source;
      const otpToken = storeInfo.storeInfo ? storeInfo.storeInfo.otpToken : "";

      Log.debug("Verifying OTP");
      const jwt = new JWT(JWT_SECRET_KEY, otpToken);
      const decoded: any = jwt.verify();

      if (decoded.otp !== Number(body.otp)) {
        Log.debug("Invalid OTP");
        response(res, 400, "Invalid OTP");
        return;
      }

      Log.debug("OTP has been Verified");

      response(res, 200, "OTP has been Verified", { verified: true });
    } catch (error) {
      Log.debug("Could not verify OTP ", error);

      let errorMsg = error.message;
      if (error.name && error.name === "TokenExpiredError") {
        errorMsg = "OTP was expired";
      }

      response(res, 400, errorMsg);
    }
  }
);

router.get(
  "/storeID/:storeID/otpCode/:otpCode/otpReferenceCode/:otpReferenceCode/",
  (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let otpCode = req.params.otpCode;
    let otpReferenceCode = req.params.otpReferenceCode;
    Otp.findOtpFromCode(storeID, otpCode, otpReferenceCode).then(
      (resultOtp: JSONData) => {
        res.send(resultOtp);
        res.end();
      }
    );
  }
);

router.post("/new/", (req: Request, res: Response) => {
  let requestBody = req.body;
  let otpID = timeUuid();

  requestBody["otpID"] = otpID;

  let updateData: JSONData = { ...requestBody };

  Log.debug("Creating new otp with data: ", updateData);

  let updateObj = new Otp(updateData, otpID);
  res.send(updateObj.getUuid());
  res.end();
  return updateObj.update(updateData);
});

router.post("/otpID/:otpID/update/", (req: Request, res: Response) => {
  let otpID = req.params.otpID;
  let requestBody = req.body;

  let updateData: JSONData = { ...requestBody };

  Log.debug("Updating otpID: " + otpID + " with data: ", updateData);
  res.send(200);
  res.end();

  let updateObj = new Otp(updateData, otpID);
  updateObj.save();
});

module.exports = router;
