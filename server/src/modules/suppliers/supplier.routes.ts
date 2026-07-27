import { Router } from "express";

import * as controller from "./supplier.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  createSupplierSchema,
  updateSupplierSchema,
} from "./supplier.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Supplier Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("supplier.read"),
  asyncHandler(controller.stats)
);

/*
|--------------------------------------------------------------------------
| Get All Suppliers
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("supplier.read"),
  asyncHandler(controller.getAll)
);

/*
|--------------------------------------------------------------------------
| Get Single Supplier
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("supplier.read"),
  asyncHandler(controller.getOne)
);

/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("supplier.create"),
  validate(createSupplierSchema),
  asyncHandler(controller.create)
);

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission("supplier.update"),
  validate(updateSupplierSchema),
  asyncHandler(controller.update)
);

/*
|--------------------------------------------------------------------------
| Restore Supplier
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  requirePermission("supplier.restore"),
  asyncHandler(controller.restore)
);

/*
|--------------------------------------------------------------------------
| Delete Supplier
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission("supplier.delete"),
  asyncHandler(controller.remove)
);
router.get(
  "/:id/stats",
  authenticate,
  requirePermission("supplier.read"),
  asyncHandler(controller.getStats)
);

export default router;