// server/src/modules/orders/order.service.ts
import { Prisma, OrderStatus, DocumentType } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import * as repository from "./order.repository";
import { CreateSalesOrderInput, UpdateSalesOrderInput } from "./order.schema";
import { generateDocumentNumber } from "../document-number/document-number.service";
import prisma from "../../lib/prisma";

export async function create(data: CreateSalesOrderInput, userId: number) {
  const customer = await prisma.customer.findFirst({
    where: { id: data.customerId, isDeleted: false },
  });
  if (!customer) throw new AppError("Customer not found.", 404);

  let subtotal = 0;
  const orderItems: Prisma.SalesOrderItemCreateWithoutOrderInput[] = [];

  for (const item of data.items) {
    const product = await prisma.product.findFirst({
      where: { id: item.productId, isDeleted: false },
    });
    if (!product) throw new AppError(`Product ${item.productId} not found.`, 404);
    if (item.quantity <= 0) {
      throw new AppError(`${product.name}: quantity must be greater than zero.`, 400);
    }

    const price = item.negotiatedPrice ?? Number(product.sellingPrice);
    const discount = item.discount ?? 0;
    const total = price * item.quantity - discount;
    subtotal += total;

    orderItems.push({
      quantity: item.quantity,
      unitPrice: Number(product.sellingPrice),
      negotiatedPrice: item.negotiatedPrice,
      total,
      product: { connect: { id: product.id } },
    });
  }

  // ✅ Include fees and discounts from the request
  const deliveryFee = data.deliveryFee ?? 0;
  const labourFee = data.labourFee ?? 0;
  const tax = data.tax ?? 0;
  const discount = data.discount ?? 0;
  const total = subtotal + deliveryFee + labourFee + tax - discount;

  const orderNumber = await generateDocumentNumber(DocumentType.SALES_ORDER);

  return prisma.$transaction(async () => {
    return repository.create({
      orderNumber,
      subtotal,
      deliveryFee,
      labourFee,
      tax,
      discount,
      total,
      notes: data.notes,
      quote: data.quoteId ? { connect: { id: data.quoteId } } : undefined,
      customer: { connect: { id: customer.id } },
      createdBy: { connect: { id: userId } },
      items: { create: orderItems },
    });
  });
}

export async function getAll(
    search?: string,
    status?: OrderStatus,
    customerId?: number,
    page = 1,
    limit = 20
) {

    const orders = await repository.getAll(
        search,
        status,
        customerId,
        page,
        limit
    );

    const total = await prisma.salesOrder.count({
        where: {
            isDeleted: false,

            ...(status && { status }),

            ...(customerId && { customerId }),

            ...(search && {
                OR: [
                    {
                        orderNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customer: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        customer: {
                            companyName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        },
    });

    return {
        data: orders,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
export async function getOne(id: number) {
  const order = await repository.findById(id);
  if (!order) throw new AppError("Sales order not found.", 404);
  return order;
}

export async function update(id: number, data: UpdateSalesOrderInput) {
  await getOne(id);
  const { items, ...orderData } = data;
  return repository.update(id, orderData);
}

export async function remove(id: number) {
  await getOne(id);
  return repository.deleteOrder(id);
}

export async function updateStatus(id: number, status: OrderStatus) {
  await getOne(id);
  return repository.updateStatus(id, status);
}

export async function stats() {
  return repository.getStats();
}

export async function restore(id: number) {
  const order = await repository.findDeletedById(id);
  if (!order) throw new AppError("Sales order not found.", 404);
  return repository.restore(id);
}

export async function approve(id: number, userId: number) {
  await getOne(id);
  return repository.approve(id, userId);
}

export async function cancel(id: number, userId: number, reason: string) {
  await getOne(id);
  return repository.cancel(id, userId, reason);
}

export async function convertFromQuote(quoteId: number, userId: number) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId, isDeleted: false },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });
  if (!quote) throw new AppError("Quote not found.", 404);
  if (quote.status !== "ACCEPTED") {
    throw new AppError("Only accepted quotes can be converted to orders.", 400);
  }

  const orderNumber = await generateDocumentNumber(DocumentType.SALES_ORDER);

  const orderItems: Prisma.SalesOrderItemCreateWithoutOrderInput[] = quote.items.map((item) => ({
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    negotiatedPrice: item.negotiatedPrice ?? undefined,
    total: item.total,
    product: { connect: { id: item.productId } },
  }));

  // ✅ Fees default to 0 – user will edit them later in OrderDetails
  return repository.create({
    orderNumber,
    customer: { connect: { id: quote.customerId } },
    createdBy: { connect: { id: userId } },
    quote: { connect: { id: quoteId } },
    subtotal: quote.subtotal,
    discount: quote.discount,
    tax: 0,
    deliveryFee: 0,
    labourFee: 0,
    total: quote.total,
    notes: quote.notes,
    status: "PENDING",
    items: { create: orderItems },
  });
}