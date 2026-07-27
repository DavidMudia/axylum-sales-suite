import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";

export function permit(...permissions: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user!;

    const role = await prisma.role.findUnique({
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
      return next(new AppError("Role not found", 403));
    }

    const userPermissions =
      role.rolePermissions.map(
        (rp) => rp.permission.name
      );

    const allowed = permissions.every((p) =>
      userPermissions.includes(p)
    );

    if (!allowed) {
      return next(
        new AppError(
          "You don't have permission to perform this action",
          403
        )
      );
    }

    next();
  };
}