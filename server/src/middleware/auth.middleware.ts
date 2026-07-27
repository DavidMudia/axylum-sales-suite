import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../utils/AppError";

interface UserPayload {
  id: number;
  email: string;
  roleId: number;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Authorization header missing", 401));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization format", 401));
  }

  try {
    const decoded = jwt.verify(
  token,
  env.JWT_SECRET
) as UserPayload;

    req.user = decoded;

    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}