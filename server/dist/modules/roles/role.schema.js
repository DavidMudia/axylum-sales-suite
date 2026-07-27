"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = exports.createRoleSchema = void 0;
// server/src/modules/roles/role.schema.ts
const zod_1 = require("zod");
exports.createRoleSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    displayName: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().optional(),
    adminPassword: zod_1.z.string().min(1, "Admin password is required"),
});
exports.updateRoleSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().optional(),
    adminPassword: zod_1.z.string().min(1, "Admin password is required"),
});
