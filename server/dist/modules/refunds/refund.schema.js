"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRefundSchema = exports.approveRefundSchema = exports.createRefundSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/
exports.createRefundSchema = zod_1.z.object({
    paymentId: zod_1.z.number().int().positive(),
    amount: zod_1.z.number().positive(),
    reason: zod_1.z
        .string()
        .min(3)
        .max(500),
    notes: zod_1.z
        .string()
        .max(1000)
        .optional(),
    refundMethod: zod_1.z.nativeEnum(client_1.RefundMethod),
});
/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/
exports.approveRefundSchema = zod_1.z.object({
    approvalNote: zod_1.z
        .string()
        .max(1000)
        .optional(),
});
/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/
exports.rejectRefundSchema = zod_1.z.object({
    rejectionReason: zod_1.z
        .string()
        .min(3)
        .max(1000),
});
