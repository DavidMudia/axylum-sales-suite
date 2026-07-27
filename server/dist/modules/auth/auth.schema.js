"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(2)
        .max(50),
    lastName: zod_1.z
        .string()
        .min(2)
        .max(50),
    employeeNumber: zod_1.z
        .string()
        .min(2)
        .max(30),
    email: zod_1.z
        .email()
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(8),
    roleId: zod_1.z
        .number()
        .int()
        .positive(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .email()
        .toLowerCase(),
    password: zod_1.z.string(),
});
