import { z } from "zod";
import { AuditModule } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export const createAuditLogSchema = z.object({

  userId: z
    .number()
    .int()
    .positive()
    .optional(),

  action: z
    .string()
    .min(1)
    .max(255),

  module: z.nativeEnum(AuditModule),

  recordId: z
    .string()
    .optional(),

  recordNumber: z
    .string()
    .optional(),

  oldValues: z
    .any()
    .optional(),

  newValues: z
    .any()
    .optional(),

  details: z
    .any()
    .optional(),

  ipAddress: z
    .string()
    .optional(),

  userAgent: z
    .string()
    .optional(),

  endpoint: z
    .string()
    .optional(),

  method: z
    .string()
    .optional(),

  statusCode: z
    .number()
    .int()
    .optional(),

});

/*
|--------------------------------------------------------------------------
| Search Audit Logs
|--------------------------------------------------------------------------
*/

export const auditLogQuerySchema = z.object({

  module: z
    .nativeEnum(AuditModule)
    .optional(),

  userId: z
    .number()
    .int()
    .positive()
    .optional(),

  search: z
    .string()
    .optional(),

  page: z
    .number()
    .int()
    .positive()
    .default(1),

  limit: z
    .number()
    .int()
    .positive()
    .default(20),

});

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type CreateAuditLogInput =
  z.infer<typeof createAuditLogSchema>;

export type AuditLogQuery =
  z.infer<typeof auditLogQuerySchema>;