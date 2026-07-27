"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceSchema = exports.createInvoiceSchema = exports.invoiceItemSchema = void 0;
const zod_1 = require("zod");
/*
|--------------------------------------------------------------------------
| Invoice Item
|--------------------------------------------------------------------------
*/
exports.invoiceItemSchema = zod_1.z.object({
    productId: zod_1.z
        .number()
        .int()
        .positive(),
    quantity: zod_1.z
        .number()
        .int()
        .positive(),
    unitPrice: zod_1.z
        .number()
        .positive(),
});
/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
*/
exports.createInvoiceSchema = zod_1.z.object({
    customerId: zod_1.z
        .number()
        .int()
        .positive(),
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
    dueDate: zod_1.z
        .coerce
        .date()
        .optional(),
    notes: zod_1.z
        .string()
        .max(1000)
        .optional(),
    discount: zod_1.z
        .number()
        .min(0)
        .optional()
        .default(0),
    tax: zod_1.z
        .number()
        .min(0)
        .optional()
        .default(0),
    items: zod_1.z
        .array(exports.invoiceItemSchema)
        .min(1),
});
/*
|--------------------------------------------------------------------------
| Update Invoice
|--------------------------------------------------------------------------
*/
exports.updateInvoiceSchema = zod_1.z.object({
    dueDate: zod_1.z
        .coerce
        .date()
        .optional(),
    deliveryFee: zod_1.z
        .number()
        .min(0)
        .optional(),
    labourFee: zod_1.z
        .number()
        .min(0)
        .optional(),
    notes: zod_1.z
        .string()
        .max(1000)
        .optional(),
    discount: zod_1.z
        .number()
        .min(0)
        .optional(),
    tax: zod_1.z
        .number()
        .min(0)
        .optional(),
});
