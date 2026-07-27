import { Router } from "express";

import * as controller from "./command-center.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  authenticate,
  asyncHandler(controller.get)
);

export default router;