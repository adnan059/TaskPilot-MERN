import { z } from "zod";
export const signInSchema = z.object({
  email: z.email("Inavalid Email Address"),
  password: z.string().min(8, "Password Is Required"),
});

export const signUpSchema = z
  .object({
    email: z.email("Invalid Email Address"),
    password: z.string().min(8, "Password Must Be Minimum 8 Chars"),
    name: z.string().min(3, "Name Must Be At Least 3 Chars"),
    confirmPassword: z.string().min(8, "Password Must Be Minimum 8 Chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords Don't Match",
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid Email Address"),
});

export const resendVerificationLinkSchema = z.object({
  email: z.email("Invalid Email Address"),
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

export const workspaceSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters"),
  color: z.string().min(3, "color must be at least 3 characters"),
  description: z.string().optional(),
});
