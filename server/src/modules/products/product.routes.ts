import { Router } from "express";

import * as controller from "./product.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createProductSchema,
  updateProductSchema,
  queryProductSchema,
} from "./product.schema";

import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/

router.get(
  "/low-stock",
  authenticate,
  requirePermission("inventory.read"),
  asyncHandler(controller.lowStock)
);

/*
|--------------------------------------------------------------------------
| Get Products
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("inventory.read"),
  validate(queryProductSchema, 'query'), // ✅ added 'query'
  asyncHandler(controller.getAll)
);

/*
|--------------------------------------------------------------------------
| Get Product
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
| Create Product
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("inventory.create"),
  validate(createProductSchema),
  asyncHandler(controller.create)
);

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission("inventory.update"),
  validate(updateProductSchema),
  asyncHandler(controller.update)
);

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission("inventory.delete"),
  asyncHandler(controller.remove)
);

/*
|--------------------------------------------------------------------------
| Restore Product
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  requirePermission("inventory.update"),
  asyncHandler(controller.restore)
);

export default router;