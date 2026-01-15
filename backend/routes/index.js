import express from "express";
import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import porjectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", porjectRoutes);

router.use("/tasks", taskRoutes);

export default router;
