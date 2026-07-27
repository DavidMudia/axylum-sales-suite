// server/src/modules/purchase-orders/purchase-order.routes.ts
import { Router } from 'express';
import * as controller from './purchase-order.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  queryPurchaseOrderSchema,
} from './purchase-order.schema';

const router = Router();

// Stats
router.get(
  '/stats',
  authenticate,
  requirePermission('purchase_order.read'),
  asyncHandler(controller.stats)
);

// List
router.get(
  '/',
  authenticate,
  requirePermission('purchase_order.read'),
  validate(queryPurchaseOrderSchema, 'query'),
  asyncHandler(controller.getAll)
);

// Get one
router.get(
  '/:id',
  authenticate,
  requirePermission('purchase_order.read'),
  asyncHandler(controller.getOne)
);

// Create
router.post(
  '/',
  authenticate,
  requirePermission('purchase_order.create'),
  validate(createPurchaseOrderSchema),
  asyncHandler(controller.create)
);

// Update
router.patch(
  '/:id',
  authenticate,
  requirePermission('purchase_order.update'),
  validate(updatePurchaseOrderSchema),
  asyncHandler(controller.update)
);

// Delete
router.delete(
  '/:id',
  authenticate,
  requirePermission('purchase_order.delete'),
  asyncHandler(controller.remove)
);

// Restore
router.patch(
  '/:id/restore',
  authenticate,
  requirePermission('purchase_order.update'),
  asyncHandler(controller.restore)
);

// Approve
router.patch(
  '/:id/approve',
  authenticate,
  requirePermission('purchase_order.approve'),
  asyncHandler(controller.approve)
);

// Cancel
router.patch(
  '/:id/cancel',
  authenticate,
  requirePermission('purchase_order.cancel'),
  asyncHandler(controller.cancel)
);

export default router;  // ✅ MUST HAVE THIS