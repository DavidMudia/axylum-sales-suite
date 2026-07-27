"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPaymentSchema = exports.approvePaymentSchema = exports.updatePaymentSchema = exports.createPaymentSchema = void 0;
// server/src/modules/payments/payment.schema.ts
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    invoiceId: zod_1.z.number().int().positive(),
    amount: zod_1.z.number().min(0),
    paymentMethod: zod_1.z.enum(["TRANSFER", "CASH", "CARD", "OTHER"]).default("TRANSFER"),
    transactionId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updatePaymentSchema = exports.createPaymentSchema.partial();
exports.approvePaymentSchema = zod_1.z.object({});
exports.cancelPaymentSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).max(500),
});
