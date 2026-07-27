import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import { asyncHandler } from "../../utils/asyncHandler";

import * as controller from "./dashboard.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  asyncHandler(
    controller.getDashboard
  )
);

export default router;