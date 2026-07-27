// server/src/modules/settings/settings.routes.ts
import { Router } from "express";
import * as controller from "./settings.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import { updateSettingsSchema } from "./settings.schema";

const router = Router();

router.get(
  "/",
  authenticate,
  asyncHandler(controller.getSettings)
);

// ✅ Use PATCH (not PUT) to match frontend
router.patch(
  "/",
  authenticate,
  validate(updateSettingsSchema),
  asyncHandler(controller.updateSettings)
);

export default router;