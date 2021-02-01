import { Log } from "../ts-utils/Log";
import { User } from "../models/User";
import Store from "../models/StoreV2";

import * as bcrypt from "bcryptjs";
import { response } from "../helpers";
import Email from "../lib/Email";
import JWT from "../lib/JWT";
import inviteEmailTemplate from "../utils/invite-email-template";
import resetPasswordTemplate from "../utils/reset-password-template";

const express = require("express");
const router = express.Router();

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

const userShema = {
  body: Joi.object({
    storeID: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    roles: Joi.array().items(Joi.string().valid("admin")),
    permissions: Joi.array(),
    actived: Joi.boolean(),
  }),
};

const findUsersByStoreShema = {
  query: Joi.object({
    storeID: Joi.string().required(),
  }),
};

const inviteUserShema = {
  body: Joi.object({
    storeID: Joi.string().required(),
    storeName: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};

const findUserSchema = {
  params: Joi.object({
    userID: Joi.string().required(),
  }),
};

const updateUserSchema = {
  params: Joi.object({
    userID: Joi.string().required(),
  }),
  body: Joi.object({
    storeID: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    roles: Joi.array().items(Joi.string().valid("admin")),
    permissions: Joi.array(),
    actived: Joi.boolean(),
    password: Joi.string().allow(""),
  }),
};

const bulkDeleteUserSchema = {
  body: Joi.object({
    userIDs: Joi.array().required(),
  }),
};

const resetPasswordShema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

const transformUser = (userInfo: any) => {
  return {
    userID: userInfo.userID,
    storeID: userInfo.storeID,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    roles: userInfo.roles,
    permissions: userInfo.permissions,
    actived: userInfo.actived,
    createdAt: userInfo.createdAt,
    updatedAt: userInfo.updatedAt,
  };
};

const hashText = (text: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedText = bcrypt.hashSync(text, salt);
  return hashedText;
};

router.get(
  "/",
  validate(findUsersByStoreShema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { query } = req;

      Log.debug("Finding users by storeID ", query.storeID);

      const user = new User();
      const userResponse = await user.findUsersByStore(query.storeID);

      const users = userResponse.hits.hits.map((userInfo: any) =>
        transformUser({ userID: userInfo._id, ...userInfo._source })
      );

      const total = userResponse.hits.total;

      Log.debug(`Found ${total} users`);

      response(res, 200, "Success", { total: total, users: users });
    } catch (error) {
      Log.debug("Could not find users by storeID ", error);
      response(res, 400, error.message);
    }
  }
);

router.get(
  "/:userID",
  validate(findUserSchema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { params } = req;
      let userInfo: any = {};

      Log.debug("Finding user by id ", params.userID);

      const user = new User();
      const userByIDResponse = await user.findUserByIDs(params.userID);

      if (userByIDResponse.hits.total === 0) {
        const userByEmailResponse = await user.findUserByEmail(params.userID);

        if (userByEmailResponse.hits.total === 0) {
          Log.debug("User not found");
          response(res, 400, "User not found");
          return;
        }

        userInfo = userByEmailResponse.hits.hits[0];
      } else {
        userInfo = userByIDResponse.hits.hits[0];
      }

      Log.debug("Found user ", userInfo);

      response(
        res,
        200,
        "Found user",
        transformUser({ userID: userInfo._id, ...userInfo._source })
      );
    } catch (error) {
      Log.debug("Could not find user by id ", error);
      response(res, 400, error.message);
    }
  }
);

router.put(
  "/:userID",
  validate(updateUserSchema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { params, body: userInfo } = req;

      Log.debug(`Updating user by id ${params.userID} with data `, userInfo);

      if (userInfo.password) {
        userInfo.password = hashText(userInfo.password);
      }

      userInfo.updatedAt = Date.now();

      const user = new User();
      await user.updateUserByID(params.userID, userInfo);

      Log.debug("User was updated");

      response(
        res,
        200,
        "User was updated",
        transformUser({ userID: params.userID, ...userInfo })
      );
    } catch (error) {
      Log.debug("Could not update user by id ", error);
      response(res, 400, error.message);
    }
  }
);

router.post("/", validate(userShema, {}, {}), async (req: any, res: any) => {
  try {
    const { body: userInfo } = req;
    Log.debug("Creating new user ", userInfo);

    userInfo.password = hashText(userInfo.password);
    userInfo.createdAt = Date.now();
    userInfo.updatedAt = Date.now();

    const user = new User();
    await user.createUser(userInfo);
    Log.debug("User was created");

    response(res, 201, "User was created", transformUser(userInfo));
  } catch (error) {
    Log.debug("Could not create new user ", error);
    response(res, 400, error.message);
  }
});

router.delete(
  "/",
  validate(bulkDeleteUserSchema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { body } = req;
      const userIDs = body.userIDs;

      Log.debug(`Deleting ${userIDs.length} users by ids `, userIDs);

      const user = new User();
      const userDeletedResult = await user.bulkDelete(userIDs);
      const deletedUsers = userDeletedResult.items
        .filter((user: any) => user.delete.found)
        .map((deletedUser: any) => deletedUser.delete._id);

      Log.debug(`Deleted ${deletedUsers.length} users `, deletedUsers);

      response(res, 200, `Deleted ${deletedUsers.length} users`, deletedUsers);
    } catch (error) {
      Log.debug("Could not delete users by ids ", error);
      response(res, 400, error.message);
    }
  }
);

router.post(
  "/invite",
  validate(inviteUserShema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { body } = req;

      Log.debug("Inviting user ", body);

      const jwt = new JWT(JWT_SECRET_KEY);
      const token = jwt.sign(
        {
          storeID: body.storeID,
          storeName: body.storeName,
          email: body.email,
        },
        {
          expiresIn: "3d",
        }
      );

      Log.debug("Token was generated: ", token);

      const mailOptions = {
        sender: "Arislab <noreply@arislab.ai>",
        receiver: body.email,
        subject: `${body.storeName} invited you to the store`,
        text: "",
        html: inviteEmailTemplate({
          url: `${process.env.WEB_URL}invite?token=${token}`,
          storeName: body.storeName,
        }),
      };

      Log.debug("Sending email");

      const email = new Email({ type: "gmail", config: EMAIL_CONFIG });
      const mailInfo = await email.send(mailOptions);

      Log.debug("Email was sent successfully", mailInfo);

      response(res, 200, "Email was sent successfully", mailInfo);
    } catch (error) {
      Log.debug("Could not invite user ", error);
      response(res, 400, error.message);
    }
  }
);

router.post(
  "/reset-password",
  validate(resetPasswordShema, {}, {}),
  async (req: any, res: any) => {
    try {
      const { email } = req.body;
      let userInfo: any = {};
      Log.debug("Resetting password ", email);

      const user = new User();
      const userResponse = await user.findUserByEmail(email);
      if (userResponse.hits.total === 0) {
        Log.debug("Finding user in store");

        const store = new Store();
        const storeResponse = await store.findStoreByEmail(email);

        if (storeResponse.hits.total === 0) {
          Log.debug("User not found");
          response(res, 400, "User not found");
          return;
        }

        Log.debug("Found user in store");

        const storeInfo = storeResponse.hits.hits[0]._source;
        const _userInfo: any = {
          storeID: storeInfo.storeID,
          firstName: "-",
          lastName: "-",
          email: email,
          actived: true,
          roles: ["owner"],
          permissions: [],
          password: hashText("default000"),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        Log.debug("Creating user to store");

        const { _id } = await user.createUser(_userInfo);

        Log.debug("User was created");

        userInfo = {
          userID: _id,
          ..._userInfo,
        };
      } else {
        const _userInfo = userResponse.hits.hits[0];
        userInfo = {
          userID: _userInfo._id,
          ..._userInfo._source,
        };
      }

      Log.debug("Found user ", userInfo);

      const jwt = new JWT(JWT_SECRET_KEY);
      const token = jwt.sign(
        {
          storeID: userInfo.storeID,
          userID: userInfo.userID,
          email: userInfo.email,
        },
        {
          expiresIn: "24h",
        }
      );

      Log.debug("Token was generated: ", token);

      const mailOptions = {
        sender: "Arislab <noreply@arislab.ai>",
        receiver: userInfo.email,
        subject: `Reset your password`,
        text: "",
        html: resetPasswordTemplate({
          url: `${process.env.WEB_URL}reset-password?token=${token}`,
        }),
      };

      Log.debug("Sending email");

      const emailProvider = new Email({ type: "gmail", config: EMAIL_CONFIG });
      const mailInfo = await emailProvider.send(mailOptions);

      Log.debug("Email was sent successfully", mailInfo);

      response(
        res,
        200,
        "Email was sent to reset password successfully",
        mailInfo
      );
    } catch (error) {
      Log.debug("Could not reset password ", error);
      response(res, 400, error.message);
    }
  }
);

module.exports = router;
