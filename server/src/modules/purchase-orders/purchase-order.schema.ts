// server/src/modules/purchase-orders/purchase-order.schema.ts
import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  supplierReference: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().positive(),
      unitCost: z.number().nonnegative(),
      discount: z.number().nonnegative().default(0),
      tax: z.number().nonnegative().default(0),
      remarks: z.string().optional(),
    })
  ).min(1),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();

export const queryPurchaseOrderSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  supplierId: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// ✅ ADD THESE TYPE EXPORTS
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;