import { Router } from "express";

import * as controller from "./invoice.controller";

import { authenticate } from "../../middleware/auth.middleware";

import { validate } from "../../middleware/validate.middleware";

import { asyncHandler } from "../../utils/asyncHandler";

import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "./invoice.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  asyncHandler(controller.stats)
);

/*
|--------------------------------------------------------------------------
| Sales Order Conversion
|--------------------------------------------------------------------------
*/

router.post(
  "/sales-order/:salesOrderId",
  authenticate,
  asyncHandler(controller.convertFromSalesOrder)
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  asyncHandler(controller.restore)
);

/*
|--------------------------------------------------------------------------
| Approve
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approve",
  authenticate,
  asyncHandler(controller.approve)
);

/*
|--------------------------------------------------------------------------
| Mark Printed
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/print",
  authenticate,
  asyncHandler(controller.markPrinted)
);

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  validate(createInvoiceSchema),
  asyncHandler(controller.create)
);

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  asyncHandler(controller.getAll)
);

/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  asyncHandler(controller.getOne)
);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  authenticate,
  validate(updateInvoiceSchema),
  asyncHandler(controller.update)
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  asyncHandler(controller.remove)
);

export default router;