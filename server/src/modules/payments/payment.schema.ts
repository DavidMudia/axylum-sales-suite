// server/src/modules/payments/payment.schema.ts
import { z } from "zod";

export const createPaymentSchema = z.object({
  invoiceId: z.number().int().positive(),
  amount: z.number().min(0),
  paymentMethod: z.enum(["TRANSFER", "CASH", "CARD", "OTHER"]).default("TRANSFER"),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export const approvePaymentSchema = z.object({});

export const cancelPaymentSchema = z.object({
  reason: z.string().min(3).max(500),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type ApprovePaymentInput = z.infer<typeof approvePaymentSchema>;
export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;