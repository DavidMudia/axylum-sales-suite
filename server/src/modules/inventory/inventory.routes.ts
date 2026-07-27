import { Router } from "express";

import * as controller from "./inventory.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  adjustInventorySchema,
} from "./inventory.schema";

import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.stats)
);

router.get(
  "/low-stock",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.lowStock)
);

/*
|--------------------------------------------------------------------------
| Out Of Stock
|--------------------------------------------------------------------------
*/

router.get(
  "/out-of-stock",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.outOfStock)
);

/*
|--------------------------------------------------------------------------
| Get All Inventory
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.getAll)
);

/*
|--------------------------------------------------------------------------
| Get Inventory History
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/history",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.history)
);

/*
|--------------------------------------------------------------------------
| Get Single Inventory
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.getOne)
);

/*
|--------------------------------------------------------------------------
| Manual Adjustment
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/adjust",
  authenticate,
  requirePermission("inventory.adjust"),
  validate(adjustInventorySchema),
  asyncHandler(controller.adjust)
);

export default router;