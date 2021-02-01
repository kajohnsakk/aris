import express from "express";
const router = express.Router();

import userRoutes from "./user/user.router";

router.use("/users", userRoutes);

export default router;
