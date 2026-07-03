import { Router } from "express";

import {
  register,
  login,
  me,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";

import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.get(
  "/me",
  authenticate,
  asyncHandler(me)
);

export default router;