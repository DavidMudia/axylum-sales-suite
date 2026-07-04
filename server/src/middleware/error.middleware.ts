import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
} from "../modules/auth/auth.service";
export async function register(req: Request, res: Response) {
  const user = await registerUser(req.body);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);

  return res.status(200).json({
    message: "Login successful",
    ...result,
  });
}

export async function me(req: Request, res: Response) {
  return res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
}