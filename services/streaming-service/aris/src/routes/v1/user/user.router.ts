import express from "express";
const router = express.Router();

import { validationHelper } from "../../../helpers";
import { userController } from "../../../controllers";
import userValidation from "./validation";

const { validate } = validationHelper;

router.get("/", userController.getUser);
router.post(
  "/insert",
  validate(userValidation.insert(), {}, {}),
  userController.insertUser
);

export default router;
