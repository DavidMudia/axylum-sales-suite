"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogQuerySchema = exports.createAuditLogSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/
exports.createAuditLogSchema = zod_1.z.object({
    userId: zod_1.z
        .number()
        .int()
        .positive()
        .optional(),
    action: zod_1.z
        .string()
        .min(1)
        .max(255),
    module: zod_1.z.nativeEnum(client_1.AuditModule),
    recordId: zod_1.z
        .string()
        .optional(),
    recordNumber: zod_1.z
        .string()
        .optional(),
    oldValues: zod_1.z
        .any()
        .optional(),
    newValues: zod_1.z
        .any()
        .optional(),
    details: zod_1.z
        .any()
        .optional(),
    ipAddress: zod_1.z
        .string()
        .optional(),
    userAgent: zod_1.z
        .string()
        .optional(),
    endpoint: zod_1.z
        .string()
        .optional(),
    method: zod_1.z
        .string()
        .optional(),
    statusCode: zod_1.z
        .number()
        .int()
        .optional(),
});
/*
|--------------------------------------------------------------------------
| Search Audit Logs
|--------------------------------------------------------------------------
*/
exports.auditLogQuerySchema = zod_1.z.object({
    module: zod_1.z
        .nativeEnum(client_1.AuditModule)
        .optional(),
    userId: zod_1.z
        .number()
        .int()
        .positive()
        .optional(),
    search: zod_1.z
        .string()
        .optional(),
    page: zod_1.z
        .number()
        .int()
        .positive()
        .default(1),
    limit: zod_1.z
        .number()
        .int()
        .positive()
        .default(20),
});
