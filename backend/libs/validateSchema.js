import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name I Required"),
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(8, "Password Must Be At Least 8 Chars"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(8, "Password Is Required"),
});

export const resendVerificationLinkSchema = z.object({
  email: z.string().email("Invalid Email Address"),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid Email Address"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 chars"),
    confirmPassword: z.string().min(8, "Password must be at least 8 chars"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
