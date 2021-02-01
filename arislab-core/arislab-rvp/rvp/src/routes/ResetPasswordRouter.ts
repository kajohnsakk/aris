const express = require("express");
const router = express.Router();
import Authentication from "../components/Authentication";
import { Log } from "../utils/Log";
import { ApiProxy } from "../components/ApiProxy";
import response from "../utils/response";

const verifyToken = (token = "") => {
  const jwt = new Authentication(token);
  const isVerified = jwt.verify();
  return isVerified;
};

router.get("/", (req: any, res: any) => {
  try {
    const { query } = req;
    const decoded: any = verifyToken(query.token);

    res.render("reset-password/reset-password", {
      layout: false,
      data: {
        email: decoded.email,
      },
    });
  } catch (error) {
    Log.debug("Could not render invite register page ", error);
    res.render("session-expire", {
      layout: false,
      message: "Your request was expired",
    });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const { body } = req;

    const decoded: any = verifyToken(body.token);
    const user = {
      firstName: "-",
      lastName: "-",
      email: decoded.email,
      storeID: decoded.storeID,
      password: body.password,
    };

    const userUpdated = await ApiProxy.getInstance().sendRequest(
      "PUT",
      `/users/${decoded.userID}`,
      user
    );

    response(res, 201, "Your password was reset successfully", userUpdated);
  } catch (error) {
    Log.debug("Could not reset password ", error.message);
    response(res, 400, error.error ? error.error.message : error.message);
  }
});

router.post("/send", async (req: any, res: any) => {
  try {
    const { body } = req;
    const payload = {
      email: body.email,
    };

    const resetPasswordResponse = await ApiProxy.getInstance().sendRequest(
      "POST",
      `/users/reset-password`,
      payload
    );

    response(res, 201, "Email has sent", resetPasswordResponse);
  } catch (error) {
    Log.debug("Could not send email for reset password ", error.message);
    response(res, 400, error.error ? error.error.message : error.message);
  }
});

module.exports = router;
