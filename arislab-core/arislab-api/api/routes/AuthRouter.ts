import { Log } from "../ts-utils/Log";
import { User } from "../models/User";
import * as bcrypt from "bcryptjs";
import { response } from "../helpers";

const express = require("express");
const router = express.Router();

const { validate, Joi } = require("express-validation");

const loginShema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

const transformUser = (userInfo: any) => {
  return {
    storeID: userInfo.storeID,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    roles: userInfo.roles,
    permissions: userInfo.permissions,
  };
};

router.post(
  "/manual",
  validate(loginShema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { body } = req;
      const { email, password } = body;

      Log.debug("Logging in with manual ", body);

      const user = new User();

      Log.debug("Finding user");
      const foundUser = await user.findUserByEmail(email);
      if (foundUser.hits.total < 1) {
        Log.debug("User not found");
        throw new Error("Invalid username or password");
      }

      const {
        password: userPassword,
        actived,
      } = foundUser.hits.hits[0]._source;

      const correctPassword = await bcrypt.compare(password, userPassword);
      if (!correctPassword) {
        Log.debug("Password incorrect");
        throw new Error("Invalid username or password");
      }

      if (!actived) {
        Log.debug("User inactive");
        throw new Error("User inactive");
      }

      const userInfo = transformUser(foundUser.hits.hits[0]._source);

      Log.debug("Logged in successfully");
      response(res, 200, "Logged in successfully", {
        isLoggedIn: true,
        ...userInfo,
      });
    } catch (error) {
      Log.debug("Logging in fails ", error);
      response(res, 400, error.message);
    }
  }
);

module.exports = router;
