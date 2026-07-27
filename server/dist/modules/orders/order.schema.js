"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalesOrderSchema = exports.createSalesOrderSchema = void 0;
const zod_1 = require("zod");
exports.createSalesOrderSchema = zod_1.z.object({
    quoteId: zod_1.z.number().int().positive().optional(),
    customerId: zod_1.z.number().int().positive(),
    deliveryAddress: zod_1.z
        .string()
        .max(500)
        .optional(),
    deliveryInstructions: zod_1.z
        .string()
        .max(1000)
        .optional(),
    expectedDeliveryDate: zod_1.z
        .coerce
        .date()
        .optional(),
    notes: zod_1.z
        .string()
        .max(1000)
        .optional(),
    deliveryFee: zod_1.z
        .number()
        .min(0)
        .optional()
        .default(0),
    labourFee: zod_1.z
        .number()
        .min(0)
        .optional()
        .default(0),
    tax: zod_1.z
        .number()
        .min(0)
        .optional()
        .default(0),
    discount: zod_1.z
        .number()
        .min(0)
        .optional()
        .default(0),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.number().int().positive(),
        quantity: zod_1.z
            .number()
            .positive(),
        unitPrice: zod_1.z
            .number()
            .nonnegative(),
        negotiatedPrice: zod_1.z
            .number()
            .nonnegative()
            .optional(),
        discount: zod_1.z
            .number()
            .nonnegative()
            .default(0),
    }))
        .min(1),
});
exports.updateSalesOrderSchema = exports.createSalesOrderSchema.partial();
