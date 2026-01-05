import express from "express";
import { authMiddleware } from "./../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { workspaceSchema } from "../libs/validateSchema.js";
import {
  createWorkspace,
  getWorkspaces,
} from "../controllers/workspaceCtrl.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

export default router;
