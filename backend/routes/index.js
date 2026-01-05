import express from "express";
import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);

export default router;
