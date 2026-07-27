// server/src/modules/users/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  employeeNumber: z.string().min(1).max(50),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  password: z.string().min(8),
  roleId: z.number().int().positive(),
  profileImage: z.string().optional(),
  loginAllowedFromMobile: z.boolean().default(true),
  loginAllowedFromDesktop: z.boolean().default(true),
  mustChangePassword: z.boolean().default(false),
  // ✅ admin password for verification
  adminPassword: z.string().min(1, "Admin password is required"),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  roleId: z.number().int().positive().optional(),
  profileImage: z.string().optional(),
  loginAllowedFromMobile: z.boolean().optional(),
  loginAllowedFromDesktop: z.boolean().optional(),
  mustChangePassword: z.boolean().optional(),
  // ✅ admin password for verification
  adminPassword: z.string().min(1, "Admin password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  mustChangePassword: z.boolean().default(true),
});

export const loginRestrictionSchema = z.object({
  loginAllowedFromMobile: z.boolean(),
  loginAllowedFromDesktop: z.boolean(),
});

export const profileImageSchema = z.object({
  profileImage: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type LoginRestrictionInput = z.infer<typeof loginRestrictionSchema>;
export type ProfileImageInput = z.infer<typeof profileImageSchema>;