const express = require("express");
const router = express.Router();
import Authentication from "../components/Authentication";
import { Log } from "../utils/Log";
import { ApiProxy } from "../components/ApiProxy";
import response from "../utils/response";

const verifyInviteToken = (token = "") => {
  const jwt = new Authentication(token);
  const isVerified = jwt.verify();
  return isVerified;
};

router.get("/", (req: any, res: any) => {
  try {
    const { query } = req;

    const decoded: any = verifyInviteToken(query.token);

    res.render("user-invite/register", {
      layout: false,
      data: {
        email: decoded.email,
      },
    });
  } catch (error) {
    Log.debug("Could not render invite register page ", error);
    res.render("session-expire", {
      layout: false,
      message: "Your invitation was expired",
    });
  }
});

router.post("/register", async (req: any, res: any) => {
  try {
    const { body } = req;

    const decoded: any = verifyInviteToken(body.token);
    const user = {
      storeID: decoded.storeID,
      firstName: body.firstName,
      lastName: body.lastName,
      email: decoded.email,
      password: body.password,
      actived: true,
    };

    const userCreated = await ApiProxy.getInstance().sendRequest(
      "POST",
      "/users",
      user
    );

    response(res, 201, "User was registerd successfully", userCreated);
  } catch (error) {
    Log.debug("Could not register new user ", error.message);
    response(res, 400, error.error ? error.error.message : error.message);
  }
});

module.exports = router;
