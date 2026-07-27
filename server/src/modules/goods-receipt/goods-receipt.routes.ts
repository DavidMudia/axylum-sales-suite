import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  verify,
  remove,
  restore,
  stats,
  dashboard,
} from "./goods-receipt.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middleware/validate.middleware";

import {
  createGoodsReceiptSchema,
  updateGoodsReceiptSchema,
} from "./goods-receipts.schema";

import { requirePermission } from "../../middleware/authorize.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  authenticate,
  requirePermission("goods-receipt.read"),
  asyncHandler(dashboard)
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("goods-receipt.read"),
  asyncHandler(stats)
);

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("goods-receipt.read"),
  asyncHandler(getAll)
);

/*
|--------------------------------------------------------------------------
| Single
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("goods-receipt.read"),
  asyncHandler(getOne)
);

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("goods-receipt.create"),
  validate(createGoodsReceiptSchema),
  asyncHandler(create)
);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission("goods-receipt.create"),
  validate(updateGoodsReceiptSchema),
  asyncHandler(update)
);

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/verify",
  authenticate,
  requirePermission("goods-receipt.approve"),
  asyncHandler(verify)
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  requirePermission("goods-receipt.create"),
  asyncHandler(restore)
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission("goods-receipt.create"),
  asyncHandler(remove)
);

export default router;