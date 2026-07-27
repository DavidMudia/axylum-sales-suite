// server/src/modules/waybills/waybill.routes.ts
import { Router } from "express";
import * as controller from "./waybill.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { createWaybillSchema, updateWaybillStatusSchema } from "./waybill.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("waybill.read"),
  asyncHandler(controller.stats)
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("waybill.read"),
  asyncHandler(controller.getAll)
);

router.get(
  "/:id",
  authenticate,
  requirePermission("waybill.read"),
  asyncHandler(controller.getOne)
);

router.post(
  "/",
  authenticate,
  requirePermission("waybill.create"),
  validate(createWaybillSchema),
  asyncHandler(controller.create)
);

router.patch(
  "/:id/status",
  authenticate,
  requirePermission("waybill.update"),
  validate(updateWaybillStatusSchema),
  asyncHandler(controller.updateStatus)
);

export default router;