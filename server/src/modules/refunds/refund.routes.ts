import { Router } from "express";

import * as controller from "./refund.controller";

import {
  authenticate,
} from "../../middleware/auth.middleware";

import {

requirePermission

} from "../../middleware/authorize.middleware";

import {
  validate,
} from "../../middleware/validate.middleware";

import {
  createRefundSchema,
  approveRefundSchema,
  rejectRefundSchema,
} from "./refund.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  requirePermission("refund.read"),
  controller.stats
);

/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission("refund.create"),
  validate(createRefundSchema),
  controller.create
);

/*
|--------------------------------------------------------------------------
| Get All Refunds
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission("refund.read"),
  controller.getAll
);

/*
|--------------------------------------------------------------------------
| Get Single Refund
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission("refund.read"),
  controller.getOne
);

/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approve",
  authenticate,
  requirePermission("refund.approve"),
  validate(approveRefundSchema),
  controller.approve
);

/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/reject",
  authenticate,
  requirePermission("refund.approve"),
  validate(rejectRefundSchema),
  controller.reject
);

export default router;