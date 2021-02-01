import express from "express";
const router = express.Router();

import { generateLabelController } from "../../../controllers";

router.post("/upload-file", generateLabelController.uploadFile);

export default router;
