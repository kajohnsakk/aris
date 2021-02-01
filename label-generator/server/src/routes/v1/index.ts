import express from "express";
const router = express.Router();

import generateLabelRoutes from "./generate-label/generate-label.router";

router.use("/generate-label", generateLabelRoutes);

export default router;
