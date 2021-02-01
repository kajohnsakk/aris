export {};
import * as AppConfig from "../config/AppConfig";
import { Log } from "../utils/Log";

const express = require("express");
const router = express.Router();
// require('dotenv').config({
//     path: '../../../../.env'
// });

const clearCookie = (
  res: any,
  cookiesList: string[],
  clear_main_domain?: boolean
) => {
  let cookieOption: { [key: string]: string } = {};

  if (clear_main_domain) {
    clearCookie(res, cookiesList);
    cookieOption["domain"] = ".arislab.ai";
  }

  cookiesList.forEach((cookie) => {
    Log.debug(`Clearing cookie: ${cookie}`);
    res.clearCookie(cookie, cookieOption);
  });
};

router.get("/", (req: any, res: any) => {
  console.log("Logging out...");
  const platformURL = `${process.env.WEB_URL}login` || AppConfig.WEB_URL;

  let cookiesList = [
    "auth0_uid",
    "token",
    "isLoggedIn",
    "email",
    "isManualLogin",
    "dotplay",
  ];
  clearCookie(res, cookiesList, true);

  res.redirect(
    `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURI(
      platformURL
    )}&client_id=${process.env.AUTH0_CLIENT_ID}`
  );
});
module.exports = router;
