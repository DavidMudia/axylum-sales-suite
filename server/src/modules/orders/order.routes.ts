// server/src/modules/orders/order.routes.ts
import { Router } from "express";
import * as controller from "./order.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createSalesOrderSchema,
  updateSalesOrderSchema,
} from "./order.schema";

const router = Router();

// Statistics
router.get(
  "/stats",
  authenticate,
  asyncHandler(controller.stats)
);

// CRUD
router.get(
  "/",
  authenticate,
  asyncHandler(controller.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(controller.getOne)
);

router.post(
  "/",
  authenticate,
  validate(createSalesOrderSchema),
  asyncHandler(controller.create)
);

router.patch(
  "/:id",
  authenticate,
  validate(updateSalesOrderSchema),
  asyncHandler(controller.update)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(controller.remove)
);

router.patch(
  "/:id/restore",
  authenticate,
  asyncHandler(controller.restore)
);

// Workflow
router.patch(
  "/:id/approve",
  authenticate,
  asyncHandler(controller.approve)
);

router.patch(
  "/:id/cancel",
  authenticate,
  asyncHandler(controller.cancel)
);

// ✅ Convert Quote → Order
router.post(
  "/convert-from-quote/:quoteId",
  authenticate,
  requirePermission("sales-order.create"),
  asyncHandler(controller.convertFromQuote)
);

export default router;