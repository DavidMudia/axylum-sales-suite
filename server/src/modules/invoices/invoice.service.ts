import prisma from "../../lib/prisma";
import crypto from "crypto";

import { AppError } from "../../utils/AppError";

import * as repository from "./invoice.repository";

import {
  CreateInvoiceInput,
} from "./invoice.schema";

import {
  InvoiceStatus,
  Prisma,DocumentType
} from "@prisma/client";

import {
  generateDocumentNumber,
} from "../document-number/document-number.service";

/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
*/

export async function create(
  data: CreateInvoiceInput,
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

  const invoiceItems:
    Prisma.InvoiceItemCreateWithoutInvoiceInput[] = [];

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
      item.unitPrice;

    const lineTotal =
      price * item.quantity;

    subtotal += lineTotal;

    invoiceItems.push({
      quantity: item.quantity,

      unitPrice: price,

      total: lineTotal,

      product: {
        connect: {
          id: product.id,
        },
      },
    });
  }

  const deliveryFee =
  data.deliveryFee ?? 0;

const labourFee =
  data.labourFee ?? 0;

const tax =
  data.tax ?? 0;

const discount =
  data.discount ?? 0;

const total =
  subtotal +
  deliveryFee +
  labourFee +
  tax -
  discount;

  const invoiceNumber =
    await generateDocumentNumber(
      DocumentType.INVOICE
    );

  const verificationCode =
    crypto.randomUUID();

  return repository.create({
  invoiceNumber,

  verificationCode,
  deliveryFee,

  labourFee,
  subtotal,

  discount,

  tax,

  total,

  balance: total,

  paymentStatus: "UNPAID",

  status: InvoiceStatus.UNPAID,

  dueDate: data.dueDate,

  notes: data.notes,

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
    create: invoiceItems,
  },
});
}

/*
|--------------------------------------------------------------------------
| Convert Sales Order → Invoice
|--------------------------------------------------------------------------
*/

export async function convertFromSalesOrder(
  salesOrderId: number,
  userId: number
) {

  const order =
    await prisma.salesOrder.findFirst({

      where: {
        id: salesOrderId,
        isDeleted: false,
      },

      include: {
        customer: true,

        items: true,
      },
    });

  if (!order) {
    throw new AppError(
      "Sales order not found.",
      404
    );
  }

  const existing =
    await prisma.invoice.findFirst({
      where: {
        salesOrderId,
        isDeleted: false,
      },
    });

  if (existing) {
    throw new AppError(
      "Invoice already exists for this sales order.",
      409
    );
  }

  const invoiceNumber =
    await generateDocumentNumber(
      DocumentType.INVOICE
    );

  const verificationCode =
    crypto.randomUUID();

  const items:
    Prisma.InvoiceItemCreateWithoutInvoiceInput[] = [];

  for (const item of order.items) {

    const sellingPrice =
      item.negotiatedPrice ??
      item.unitPrice;

    items.push({

      quantity:
        item.quantity,

      unitPrice:
        sellingPrice,

      total:
        item.total,

      product: {
        connect: {
          id:
            item.productId,
        },
      },
    });
  }

  return repository.create({
  invoiceNumber,

  verificationCode,

  subtotal: order.subtotal,

  deliveryFee: order.deliveryFee,

  labourFee: order.labourFee,

  discount: order.discount,

  tax: order.tax,

  total: order.total,

  balance: order.total,

  paymentStatus: "UNPAID",

  status: InvoiceStatus.UNPAID,

  notes: order.notes,

  customer: {
    connect: {
      id: order.customerId,
    },
  },

  salesOrder: {
    connect: {
      id: order.id,
    },
  },

  createdBy: {
    connect: {
      id: userId,
    },
  },

  items: {
    create: items,
  },
});
}
/*
|--------------------------------------------------------------------------
| Get All Invoices
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  status?: InvoiceStatus,
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

/*
|--------------------------------------------------------------------------
| Get Single Invoice
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {
  const invoice =
    await repository.findById(id);

  if (!invoice) {
    throw new AppError(
      "Invoice not found.",
      404
    );
  }

  return invoice;
}

/*
|--------------------------------------------------------------------------
| Update Invoice
|--------------------------------------------------------------------------
*/

export async function update(
  id: number,
  data: Prisma.InvoiceUpdateInput
) {

  const invoice =
    await getOne(id);

  if (invoice.status === "PAID") {
    throw new AppError(
      "Paid invoices cannot be modified.",
      400
    );
  }

  if (invoice.isPrinted) {
    throw new AppError(
      "Printed invoices cannot be modified.",
      400
    );
  }

  return repository.update(
    id,
    data
  );
}

/*
|--------------------------------------------------------------------------
| Approve Invoice
|--------------------------------------------------------------------------
*/

export async function approve(
  id: number,
  userId: number,
  note?: string
) {

  await getOne(id);

  return repository.approve(
    id,
    userId,
    note
  );
}
/*
|--------------------------------------------------------------------------
| Mark Invoice as Printed
|--------------------------------------------------------------------------
*/

export async function markPrinted(
  id: number
) {
  const invoice =
    await getOne(id);

  if (invoice.isPrinted) {
    throw new AppError(
      "Invoice has already been printed.",
      400
    );
  }

  return repository.markPrinted(id);
}

/*
|--------------------------------------------------------------------------
| Soft Delete Invoice
|--------------------------------------------------------------------------
*/

export async function remove(
  id: number
) {
  const invoice =
    await getOne(id);

  if (invoice.status === "PAID") {
    throw new AppError(
      "Paid invoices cannot be deleted.",
      400
    );
  }

  return repository.softDelete(id);
}

/*
|--------------------------------------------------------------------------
| Restore Invoice
|--------------------------------------------------------------------------
*/

export async function restore(
  id: number
) {
  const invoice =
    await prisma.invoice.findFirst({
      where: {
        id,
        isDeleted: true,
      },
    });

  if (!invoice) {
    throw new AppError(
      "Invoice not found.",
      404
    );
  }

  return repository.restore(id);
}

/*
|--------------------------------------------------------------------------
| Invoice Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}