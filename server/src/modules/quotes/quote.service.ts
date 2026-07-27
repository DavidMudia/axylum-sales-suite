import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

import * as repository from "./quote.repository";

import {
  CreateQuoteInput,
  UpdateQuoteInput,
} from "./quote.schema";

import {
  QuoteStatus,
  Prisma,
} from "@prisma/client";

import {
  generateDocumentNumber,
} from "../document-number/document-number.service";
import crypto from "crypto";

export async function create(
  data: CreateQuoteInput,
  userId: number
) {
  const customer =
    await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        isDeleted: false,
      },
    });

  if (!customer) {
    throw new AppError(
      "Customer not found.",
      404
    );
  }

  let subtotal = 0;

  const quoteItems: Prisma.QuoteItemCreateWithoutQuoteInput[] =
    [];

  for (const item of data.items) {
    const product =
      await prisma.product.findFirst({
        where: {
          id: item.productId,
          isDeleted: false,
        },
      });

    if (!product) {
      throw new AppError(
        `Product ${item.productId} not found.`,
        404
      );
    }

    if (item.quantity <= 0) {
      throw new AppError(
        `${product.name}: quantity must be greater than zero.`,
        400
      );
    }

    const price =
  item.negotiatedPrice ??
  Number(product.sellingPrice);

    const discount =
      item.discount ?? 0;

    const lineTotal =
      price * item.quantity - discount;

    subtotal += lineTotal;

    quoteItems.push({
  quantity: item.quantity,

unitPrice: Number(product.sellingPrice),

  negotiatedPrice: item.negotiatedPrice,

  discount,

  total: lineTotal,

  remarks: item.remarks,

  product: {
    connect: {
      id: product.id,
    },
  },
});
  }

  const tax = 0;

  const total =
    subtotal + tax;

  const quoteNumber =
  await generateDocumentNumber("QUOTE");

  const verificationCode =
    crypto.randomUUID();

  return prisma.$transaction(async () => {
    return repository.create({
      quoteNumber,

      verificationCode,

      subtotal,

      discount: 0,

      tax,

      total,

      notes: data.notes,

      validUntil:
        data.validUntil,

      customer: {
        connect: {
          id: customer.id,
        },
      },

      createdBy: {
        connect: {
          id: userId,
        },
      },

      items: {
        create: quoteItems,
      },
    });
  });
}

export async function getAll(
  search?: string,
  status?: QuoteStatus,
  page = 1,
  limit = 20
) {
  return repository.getAll(
    search,
    status,
    page,
    limit
  );
}
export async function getOne(
  id: number
) {
  const quote =
    await repository.findById(id);

  if (!quote) {
    throw new AppError(
      "Quote not found.",
      404
    );
  }

  return quote;
}

export async function update(
  id: number,
  data: UpdateQuoteInput
) {
  await getOne(id);

  return repository.update(id, {
    notes: data.notes,
    validUntil: data.validUntil,
});
}

export async function remove(
  id: number
) {
  await getOne(id);

  return repository.softDelete(id);
}

export async function restore(
  id: number
) {
  return repository.restore(id);
}

export async function approve(
  id: number,
  userId: number
) {
  await getOne(id);

  return repository.approve(
    id,
    userId
  );
}

export async function reject(
  id: number,
  userId: number,
  note: string
) {
  await getOne(id);

  return repository.reject(
    id,
    userId,
    note
  );
}

export async function stats() {
  return repository.getStats();
}
export async function convertToInvoice(
  quoteId: number,
  userId: number
) {
  throw new AppError(
    "Quote to Invoice conversion has not been implemented yet.",
    501
  );
}