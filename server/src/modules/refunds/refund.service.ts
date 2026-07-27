import prisma from "../../lib/prisma";

import crypto from "crypto";

import { AppError } from "../../utils/AppError";
import {
  logRefund,
} from "../audit-log/audit-log.service";
import * as repository from "./refund.repository";

import {
  CreateRefundInput,
} from "./refund.schema";

import {
  InvoicePaymentStatus,
  InvoiceStatus,
  PaymentStatus,
  RefundStatus,
} from "@prisma/client";

import {
  generateDocumentNumber,
} from "../document-number/document-number.service";
import { DocumentType } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/

export async function create(
  data: CreateRefundInput,
  userId: number
) {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: data.paymentId,
      },

      include: {
        invoice: true,
        customer: true,
      },
    });

  if (!payment) {
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  if (
    payment.status !==
    PaymentStatus.COMPLETED
  ) {
    throw new AppError(
      "Only completed payments can be refunded.",
      400
    );
  }

  const remaining =
    payment.amount -
    payment.refundedAmount;

  if (data.amount > remaining) {
    throw new AppError(
      "Refund amount exceeds remaining refundable balance.",
      400
    );
  }

  const refundNumber =
    await generateDocumentNumber(
      DocumentType.REFUND
    );

  return prisma.$transaction(
    async (tx) => {

      const refund =
  await repository.create(
    tx,
    {
      refundNumber,

      verificationCode:
        crypto.randomUUID(),

      amount:
        data.amount,

      reason:
        data.reason,

      notes:
        data.notes,

      refundMethod:
        data.refundMethod,

      status:
        RefundStatus.PENDING,

      payment: {
        connect: {
          id: payment.id,
        },
      },

      invoice: {
        connect: {
          id:
            payment.invoiceId,
        },
      },

      customer: {
        connect: {
          id:
            payment.customerId,
        },
      },

      processedBy: {
        connect: {
          id: userId,
        },
      },
    }
  );

await logRefund(
  "Refund Created",
  refund,
  userId,
  {
    amount: refund.amount,
    paymentId: refund.paymentId,
    reason: refund.reason,
  }
);

return refund;
    }
  );
}

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  status?: RefundStatus,
  customerId?: number,
  page = 1,
  limit = 20
) {
  const data = await repository.getAll(
    search,
    status,
    customerId,
    page,
    limit
  );

  const total = await prisma.refund.count({
    where: {
      ...(status && { status }),
      ...(customerId && { customerId }),
      ...(search && {
        OR: [
          {
            refundNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            reason: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {
  const refund =
    await repository.findById(id);

  if (!refund) {
    throw new AppError(
      "Refund not found.",
      404
    );
  }

  return refund;
}
/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/

export async function approve(
  id: number,
  userId: number,
  approvalNote?: string
) {
  const refund =
    await getOne(id);

  if (
    refund.status ===
    RefundStatus.APPROVED
  ) {
    throw new AppError(
      "Refund has already been approved.",
      400
    );
  }

  if (
    refund.status ===
    RefundStatus.REJECTED
  ) {
    throw new AppError(
      "Rejected refunds cannot be approved.",
      400
    );
  }

  return prisma.$transaction(
    async (tx) => {

      const payment =
        await tx.payment.findUnique({
          where: {
            id: refund.paymentId,
          },
        });

      if (!payment) {
        throw new AppError(
          "Payment not found.",
          404
        );
      }

      const invoice =
        await tx.invoice.findUnique({
          where: {
            id: refund.invoiceId,
          },
        });

      if (!invoice) {
        throw new AppError(
          "Invoice not found.",
          404
        );
      }

      const refundedAmount =
        payment.refundedAmount +
        refund.amount;

      await tx.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          refundedAmount,
        },
      });

      const amountPaid =
        Math.max(
          0,
          invoice.amountPaid -
            refund.amount
        );

      const balance =
        invoice.total -
        amountPaid;

      let paymentStatus:
        InvoicePaymentStatus =
        InvoicePaymentStatus.PARTIAL;

      let invoiceStatus:
        InvoiceStatus =
        InvoiceStatus.PARTIAL;

      if (amountPaid <= 0) {
        paymentStatus =
          InvoicePaymentStatus.UNPAID;

        invoiceStatus =
          InvoiceStatus.UNPAID;
      }

      if (balance <= 0) {
        paymentStatus =
          InvoicePaymentStatus.PAID;

        invoiceStatus =
          InvoiceStatus.PAID;
      }

      await tx.invoice.update({
        where: {
          id: invoice.id,
        },

        data: {
          amountPaid,

          balance,

          paymentStatus,

          status:
            invoiceStatus,
        },
      });

      const approvedRefund =
  await repository.update(
    tx,
    refund.id,
    {
      status:
        RefundStatus.APPROVED,

      approvedAt:
        new Date(),

      approvedBy: {
        connect: {
          id: userId,
        },
      },
    }
  );

await logRefund(
  "Refund Approved",
  approvedRefund,
  userId,
  {
    approvalNote,
  }
);

return approvedRefund;
    }
  );
}

/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/

export async function reject(
  id: number,
  reason: string,
  userId: number
) {
  const refund =
    await getOne(id);

  if (
    refund.status !==
    RefundStatus.PENDING
  ) {
    throw new AppError(
      "Only pending refunds can be rejected.",
      400
    );
  }

  const rejectedRefund =
  await repository.update(
    prisma,
    id,
    {
      status:
        RefundStatus.REJECTED,

      rejectionReason:
        reason,
    }
  );

await logRefund(
  "Refund Rejected",
  rejectedRefund,
  userId,
  {
    reason,
  }
);

return rejectedRefund;
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}
