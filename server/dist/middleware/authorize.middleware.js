"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
function requirePermission(permission) {
    return async (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError("Unauthorized", 401));
        }
        const role = await prisma_1.default.role.findUnique({
            where: { id: req.user.roleId },
            include: {
                rolePermissions: {
                    include: { permission: true },
                },
            },
        });
        if (!role) {
            return next(new AppError_1.AppError("Role not found", 403));
        }
        // ✅ SUPER_ADMIN bypasses all permission checks
        if (role.name === "SUPER_ADMIN") {
            return next();
        }
        const hasPermission = role.rolePermissions.some((rp) => rp.permission.name === permission);
        if (!hasPermission) {
            return next(new AppError_1.AppError("Forbidden", 403));
        }
        next();
    };
}
