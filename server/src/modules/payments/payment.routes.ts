// server/src/modules/payments/payment.routes.ts
import { Router } from "express";
import * as controller from "./payment.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import {
  createPaymentSchema,
  updatePaymentSchema,
  approvePaymentSchema,
  cancelPaymentSchema,
} from "./payment.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("payment.read"),
  asyncHandler(controller.getAll)
);
router.get(
  "/stats",
  authenticate,
  requirePermission("payment.read"),
  asyncHandler(controller.stats)
);
/*
|--------------------------------------------------------------------------
| Get Single Payment
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("payment.read"),
  asyncHandler(controller.getOne)
);

/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("payment.create"),
  validate(createPaymentSchema),
  asyncHandler(controller.create)
);

/*
|--------------------------------------------------------------------------
| Update Payment
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission("payment.update"),
  validate(updatePaymentSchema),
  asyncHandler(controller.update)
);

/*
|--------------------------------------------------------------------------
| Approve Payment
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approve",
  authenticate,
  requirePermission("payment.approve"),
  validate(approvePaymentSchema),
  asyncHandler(controller.approve)
);

/*
|--------------------------------------------------------------------------
| Cancel Payment
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/cancel",
  authenticate,
  requirePermission("payment.cancel"),
  validate(cancelPaymentSchema),
  asyncHandler(controller.cancel)
);

export default router;