const express = require("express");
const router = express.Router();

const { validate, Joi } = require("express-validation");

import ControlPanelController from "../controllers/ControlpanelController";
const controlPanelController = new ControlPanelController();

const storeAccessSchema = {
  body: Joi.object({
    storeID: Joi.string().required(),
  }),
};

/**
 * Access to another store with developer permission
 */
router.post(
  "/stores/access",
  validate(storeAccessSchema, {}, {}),
  controlPanelController.storeAccess
);

module.exports = router;
