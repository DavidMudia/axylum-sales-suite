import { Router } from "express";

import * as controller from "./warehouse.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  createWarehouseSchema,
  updateWarehouseSchema,
} from "./warehouse.schema";

const router = Router();
router.get(
  "/dashboard",
  authenticate,
  requirePermission("warehouse.read"),
  asyncHandler(controller.dashboard)
);
/*
|--------------------------------------------------------------------------
| Warehouse Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("warehouse.read"),
  asyncHandler(controller.stats)
);

/*
|--------------------------------------------------------------------------
| Get All Warehouses
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("warehouse.read"),
  asyncHandler(controller.getAll)
);
router.get(
  "/dashboard",
  authenticate,
  requirePermission(
    "warehouse.read"
  ),
  asyncHandler(
    controller.dashboard
  )
);
/*
|--------------------------------------------------------------------------
| Get Single Warehouse
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("warehouse.read"),
  asyncHandler(controller.getOne)
);

/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("warehouse.create"),
  validate(createWarehouseSchema),
  asyncHandler(controller.create)
);

/*
|--------------------------------------------------------------------------
| Update Warehouse
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission("warehouse.update"),
  validate(updateWarehouseSchema),
  asyncHandler(controller.update)
);

/*
|--------------------------------------------------------------------------
| Activate Warehouse
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/activate",
  authenticate,
  requirePermission("warehouse.update"),
  asyncHandler(controller.activate)
);

/*
|--------------------------------------------------------------------------
| Deactivate Warehouse
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/deactivate",
  authenticate,
  requirePermission("warehouse.update"),
  asyncHandler(controller.deactivate)
);

/*
|--------------------------------------------------------------------------
| Restore Warehouse
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  requirePermission("warehouse.delete"),
  asyncHandler(controller.restore)
);

/*
|--------------------------------------------------------------------------
| Delete Warehouse
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission("warehouse.delete"),
  asyncHandler(controller.remove)
);

export default router;