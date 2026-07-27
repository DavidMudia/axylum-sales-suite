import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2)
    .max(50),

  lastName: z
    .string()
    .min(2)
    .max(50),

  employeeNumber: z
    .string()
    .min(2)
    .max(30),

  email: z
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8),

  roleId: z
    .number()
    .int()
    .positive(),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email()
    .toLowerCase(),

  password: z.string(),
});

export type LoginInput =
  z.infer<typeof loginSchema>;