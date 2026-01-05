import express from "express";

import { validateRequest } from "zod-express-middleware";
import {
  loginSchema,
  registerSchema,
  resendVerificationLinkSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../libs/validateSchema.js";
import {
  loginUserCtrl,
  registerUserCtrl,
  resendVerificationLinkCtrl,
  resetPasswordCtrl,
  resetPasswordRequest,
  verifyEmailCtrl,
} from "../controllers/authCtrls.js";
import { authMiddleware } from "./../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUserCtrl
);

router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUserCtrl
);

router.post("/verify", authMiddleware, verifyEmailCtrl);

router.post(
  "/resend-verification-link",
  validateRequest({
    body: resendVerificationLinkSchema,
  }),
  resendVerificationLinkCtrl
);

router.post(
  "/reset-password-request",
  validateRequest({
    body: resetPasswordRequestSchema,
  }),
  resetPasswordRequest
);

router.put(
  "/reset-password",
  validateRequest({
    body: resetPasswordSchema,
  }),
  resetPasswordCtrl
);

export default router;
