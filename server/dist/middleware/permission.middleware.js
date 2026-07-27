"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permit = permit;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
function permit(...permissions) {
    return async (req, res, next) => {
        const user = req.user;
        const role = await prisma_1.default.role.findUnique({
            where: {
                id: user.roleId,
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        if (!role) {
            return next(new AppError_1.AppError("Role not found", 403));
        }
        const userPermissions = role.rolePermissions.map((rp) => rp.permission.name);
        const allowed = permissions.every((p) => userPermissions.includes(p));
        if (!allowed) {
            return next(new AppError_1.AppError("You don't have permission to perform this action", 403));
        }
        next();
    };
}
