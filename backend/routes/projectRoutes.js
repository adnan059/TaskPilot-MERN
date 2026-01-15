import express from "express";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { projectSchema } from "../libs/validateSchema.js";
import { createProject } from "../controllers/projectCtrl.js";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: projectSchema,
  }),
  createProject
);

export default router;
