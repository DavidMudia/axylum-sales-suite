import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";

import {
  registerUser,
  loginUser,
} from "./auth.service";

export async function register(req: AuthRequest, res: Response) {
  const user = await registerUser(req.body);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
}

export async function login(req: AuthRequest, res: Response) {
  const result = await loginUser(req.body);

  return res.status(200).json({
    message: "Login successful",
    ...result,
  });
}

export async function me(req: AuthRequest, res: Response) {
  return res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
}