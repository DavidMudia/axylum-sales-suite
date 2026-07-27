import { z } from "zod";

import {
  RefundMethod,
} from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/

export const createRefundSchema =
  z.object({
    paymentId:
      z.number().int().positive(),

    amount:
      z.number().positive(),

    reason:
      z
        .string()
        .min(3)
        .max(500),

    notes:
      z
        .string()
        .max(1000)
        .optional(),

    refundMethod:
      z.nativeEnum(
        RefundMethod
      ),
  });

/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/

export const approveRefundSchema =
  z.object({
    approvalNote:
      z
        .string()
        .max(1000)
        .optional(),
  });

/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/

export const rejectRefundSchema =
  z.object({
    rejectionReason:
      z
        .string()
        .min(3)
        .max(1000),
  });

/*
|--------------------------------------------------------------------------
| Export Types
|--------------------------------------------------------------------------
*/

export type CreateRefundInput =
  z.infer<
    typeof createRefundSchema
  >;

export type ApproveRefundInput =
  z.infer<
    typeof approveRefundSchema
  >;

export type RejectRefundInput =
  z.infer<
    typeof rejectRefundSchema
  >;