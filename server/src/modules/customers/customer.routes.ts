import { Router } from "express";

import * as controller from "./customer.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("customer.read"),
  asyncHandler(controller.stats)
);

/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("customer.create"),
  validate(createCustomerSchema),
  asyncHandler(controller.create)
);

/*
|--------------------------------------------------------------------------
| Get All Customers
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("customer.read"),
  asyncHandler(controller.getAll)
);

/*
|--------------------------------------------------------------------------
| Get Single Customer
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("customer.read"),
  asyncHandler(controller.getOne)
);

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission("customer.update"),
  validate(updateCustomerSchema),
  asyncHandler(controller.update)
);

/*
|--------------------------------------------------------------------------
| Restore Customer
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  requirePermission("customer.update"),
  asyncHandler(controller.restore)
);

/*
|--------------------------------------------------------------------------
| Delete Customer
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission("customer.delete"),
  asyncHandler(controller.remove)
);

export default router;