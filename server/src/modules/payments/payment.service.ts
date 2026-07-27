// server/src/modules/payments/payment.service.ts
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import * as repository from "./payment.repository";
import { logPayment } from "../audit-log/audit-log.service";
import { CreatePaymentInput, UpdatePaymentInput } from "./payment.schema";
import {
  InvoicePaymentStatus,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  DocumentType,
} from "@prisma/client";
import { generateDocumentNumber } from "../document-number/document-number.service";
import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

export async function create(data: CreatePaymentInput, userId: number) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: data.invoiceId, isDeleted: false },
  });

  if (!invoice) throw new AppError("Invoice not found.", 404);
  if (invoice.paymentStatus === InvoicePaymentStatus.PAID) {
    throw new AppError("Invoice has already been paid.", 400);
  }
  if (data.amount <= 0) {
    throw new AppError("Payment amount must be greater than zero.", 400);
  }
  if (data.amount > invoice.balance) {
    throw new AppError(
      `Payment exceeds outstanding balance of ₦${invoice.balance}.`,
      400
    );
  }

  const paymentNumber = await generateDocumentNumber(DocumentType.PAYMENT);
  const receiptNumber = `RCPT-${new Date().getFullYear()}-${Date.now()}`;
  const verificationCode = crypto.randomUUID();

  return prisma.$transaction(async (tx) => {
    return repository.create(tx, {
      paymentNumber,
      receiptNumber,
      verificationCode,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      notes: data.notes,
      status: PaymentStatus.PENDING,
      customer: { connect: { id: invoice.customerId } },
      invoice: { connect: { id: invoice.id } },
      createdBy: { connect: { id: userId } },
    });
  });
}

/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  status?: PaymentStatus,
  method?: PaymentMethod,
  customerId?: number,
  refundable = false,
  page = 1,
  limit = 20
) {
  const [data, total] = await Promise.all([
    repository.getAll(
      search,
      status,
      method,
      customerId,
      refundable,
      page,
      limit
    ),

    repository.count(
      search,
      status,
      method,
      customerId,
      refundable
    ),
  ]);

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
| Get Single Payment
|--------------------------------------------------------------------------
*/

export async function getOne(id: number) {
  // ✅ Guard against invalid ID
  if (!id || isNaN(id)) {
    throw new AppError("Invalid payment ID", 400);
  }
  const payment = await repository.findById(id);
  if (!payment) throw new AppError("Payment not found.", 404);
  return payment;
}

/*
|--------------------------------------------------------------------------
| Update Payment
|--------------------------------------------------------------------------
*/

export async function update(id: number, data: UpdatePaymentInput) {
  const payment = await getOne(id);
  if (payment.status === PaymentStatus.COMPLETED) {
    throw new AppError("Completed payments cannot be modified.", 400);
  }
  if (payment.status === PaymentStatus.CANCELLED) {
    throw new AppError("Cancelled payments cannot be modified.", 400);
  }
  return repository.update(id, data as Prisma.PaymentUpdateInput);
}

/*
|--------------------------------------------------------------------------
| Approve Payment
|--------------------------------------------------------------------------
*/

export async function approve(id: number, userId: number) {
  const payment = await getOne(id);
  if (payment.status === PaymentStatus.COMPLETED) {
    throw new AppError("Payment has already been approved.", 400);
  }
  if (payment.status === PaymentStatus.CANCELLED) {
    throw new AppError("Cancelled payments cannot be approved.", 400);
  }

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: payment.invoiceId },
    });
    if (!invoice) throw new AppError("Invoice not found.", 404);

    const amountPaid = invoice.amountPaid + payment.amount;
    const balance = invoice.total - amountPaid;

    let paymentStatus: InvoicePaymentStatus = InvoicePaymentStatus.PARTIAL;
    let invoiceStatus: InvoiceStatus = InvoiceStatus.PARTIAL;

    if (balance <= 0) {
      paymentStatus = InvoicePaymentStatus.PAID;
      invoiceStatus = InvoiceStatus.PAID;
    }

    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        amountPaid,
        balance,
        paymentStatus,
        status: invoiceStatus,
      },
    });

    return tx.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.COMPLETED,
        approvedAt: new Date(),
        approvedBy: { connect: { id: userId } },
      },
      include: { invoice: true, customer: true },
    });
  });
}

/*
|--------------------------------------------------------------------------
| Cancel Payment
|--------------------------------------------------------------------------
*/

export async function cancel(id: number, userId: number, reason: string) {
  const payment = await getOne(id);
  if (payment.status === PaymentStatus.CANCELLED) {
    throw new AppError("Payment is already cancelled.", 400);
  }
  if (payment.status === PaymentStatus.COMPLETED) {
    throw new AppError(
      "Completed payments cannot be cancelled. Issue a refund instead.",
      400
    );
  }

  return prisma.payment.update({
    where: { id },
    data: {
      status: PaymentStatus.CANCELLED,
      cancelledAt: new Date(),
      cancellationReason: reason,
      cancelledBy: { connect: { id: userId } },
    },
    include: { invoice: true, customer: true },
  });
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}
