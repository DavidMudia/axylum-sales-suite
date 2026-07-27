"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileImageSchema = exports.loginRestrictionSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
// server/src/modules/users/user.schema.ts
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    employeeNumber: zod_1.z.string().min(1).max(50),
    firstName: zod_1.z.string().min(2).max(100),
    lastName: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().max(20).optional(),
    password: zod_1.z.string().min(8),
    roleId: zod_1.z.number().int().positive(),
    profileImage: zod_1.z.string().optional(),
    loginAllowedFromMobile: zod_1.z.boolean().default(true),
    loginAllowedFromDesktop: zod_1.z.boolean().default(true),
    mustChangePassword: zod_1.z.boolean().default(false),
    // ✅ admin password for verification
    adminPassword: zod_1.z.string().min(1, "Admin password is required"),
});
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(100).optional(),
    lastName: zod_1.z.string().min(2).max(100).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().max(20).optional(),
    roleId: zod_1.z.number().int().positive().optional(),
    profileImage: zod_1.z.string().optional(),
    loginAllowedFromMobile: zod_1.z.boolean().optional(),
    loginAllowedFromDesktop: zod_1.z.boolean().optional(),
    mustChangePassword: zod_1.z.boolean().optional(),
    // ✅ admin password for verification
    adminPassword: zod_1.z.string().min(1, "Admin password is required"),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8),
});
exports.resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(8),
    mustChangePassword: zod_1.z.boolean().default(true),
});
exports.loginRestrictionSchema = zod_1.z.object({
    loginAllowedFromMobile: zod_1.z.boolean(),
    loginAllowedFromDesktop: zod_1.z.boolean(),
});
exports.profileImageSchema = zod_1.z.object({
    profileImage: zod_1.z.string(),
});
