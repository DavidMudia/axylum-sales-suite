"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuoteSchema = exports.createQuoteSchema = exports.createQuoteItemSchema = void 0;
const zod_1 = require("zod");
exports.createQuoteItemSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
    quantity: zod_1.z.number().positive(),
    unitPrice: zod_1.z.number().nonnegative(),
    negotiatedPrice: zod_1.z.number().nonnegative().optional(),
    discount: zod_1.z.number().min(0).default(0),
    remarks: zod_1.z.string().max(300).optional(),
});
exports.createQuoteSchema = zod_1.z.object({
    customerId: zod_1.z.number().int().positive(),
    validUntil: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().max(1000).optional(),
    deliveryAddress: zod_1.z.string().max(500).optional(),
    deliveryInstructions: zod_1.z
        .string()
        .max(500)
        .optional(),
    items: zod_1.z
        .array(exports.createQuoteItemSchema)
        .min(1, "Quote must contain at least one item."),
});
exports.updateQuoteSchema = exports.createQuoteSchema.partial();
