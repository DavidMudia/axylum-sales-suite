"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPurchaseOrderSchema = exports.updatePurchaseOrderSchema = exports.createPurchaseOrderSchema = void 0;
// server/src/modules/purchase-orders/purchase-order.schema.ts
const zod_1 = require("zod");
exports.createPurchaseOrderSchema = zod_1.z.object({
    supplierId: zod_1.z.number().int().positive(),
    warehouseId: zod_1.z.number().int().positive(),
    supplierReference: zod_1.z.string().optional(),
    expectedDeliveryDate: zod_1.z.string().optional(),
    deliveryAddress: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().positive(),
        unitCost: zod_1.z.number().nonnegative(),
        discount: zod_1.z.number().nonnegative().default(0),
        tax: zod_1.z.number().nonnegative().default(0),
        remarks: zod_1.z.string().optional(),
    })).min(1),
});
exports.updatePurchaseOrderSchema = exports.createPurchaseOrderSchema.partial();
exports.queryPurchaseOrderSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    supplierId: zod_1.z.coerce.number().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
});
