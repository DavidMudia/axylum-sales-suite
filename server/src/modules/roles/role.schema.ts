// server/src/modules/roles/role.schema.ts
import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2).max(50),
  displayName: z.string().min(2).max(100),
  description: z.string().optional(),
  adminPassword: z.string().min(1, "Admin password is required"),
});

export const updateRoleSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  adminPassword: z.string().min(1, "Admin password is required"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;