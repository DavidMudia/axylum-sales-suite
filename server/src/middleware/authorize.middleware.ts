import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const role = await prisma.role.findUnique({
      where: { id: req.user.roleId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) {
      return next(new AppError("Role not found", 403));
    }

    // ✅ SUPER_ADMIN bypasses all permission checks
    if (role.name === "SUPER_ADMIN") {
      return next();
    }

    const hasPermission = role.rolePermissions.some(
      (rp) => rp.permission.name === permission
    );

    if (!hasPermission) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}