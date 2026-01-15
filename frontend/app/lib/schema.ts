import { ProjectStatus } from "@/types";
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

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(ProjectStatus),
  startDate: z.string().min(10, "Start date is required"),
  dueDate: z.string().min(10, "Due date is required"),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    )
    .optional(),
  tags: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});

export const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member", "viewer"]),
});
