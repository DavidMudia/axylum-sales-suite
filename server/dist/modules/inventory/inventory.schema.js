"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryQuerySchema = exports.adjustInventorySchema = void 0;
const zod_1 = require("zod");
/*
|--------------------------------------------------------------------------
| Adjust Stock
|--------------------------------------------------------------------------
*/
exports.adjustInventorySchema = zod_1.z.object({
    quantity: zod_1.z.number(),
    reason: zod_1.z
        .string()
        .min(3)
        .max(255),
    notes: zod_1.z
        .string()
        .optional(),
});
/*
|--------------------------------------------------------------------------
| Inventory Query
|--------------------------------------------------------------------------
*/
exports.inventoryQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    lowStock: zod_1.z.coerce
        .boolean()
        .optional(),
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
