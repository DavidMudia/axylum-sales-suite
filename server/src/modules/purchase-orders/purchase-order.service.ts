import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

import * as repository from "./purchase-order.repository";

import {
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
} from "./purchase-order.schema";

import {
  Prisma,
  PurchaseOrderStatus,
  DocumentType,
} from "@prisma/client";

import { generateDocumentNumber } from "../document-number/document-number.service";

export async function create(
  data: CreatePurchaseOrderInput,
  userId: number
) {
  const supplier = await prisma.supplier.findFirst({
    where: { id: data.supplierId, isDeleted: false },
  });
  if (!supplier) throw new AppError("Supplier not found.", 404);

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: data.warehouseId },
  });
  if (!warehouse) throw new AppError("Warehouse not found.", 404);

  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  const items: Prisma.PurchaseOrderItemCreateWithoutPurchaseOrderInput[] = [];

  for (const item of data.items) {
    const product = await prisma.product.findFirst({
      where: { id: item.productId, isDeleted: false },
    });
    if (!product) {
      throw new AppError(`Product ${item.productId} not found.`, 404);
    }

    const lineSubtotal = item.unitCost * item.quantity;
    const lineDiscount = item.discount ?? 0;
    const taxableAmount = lineSubtotal - lineDiscount;
    const lineTax = item.tax ?? 0;
    const lineTotal = taxableAmount + lineTax;

    subtotal += lineSubtotal;
    totalDiscount += lineDiscount;
    totalTax += lineTax;

    items.push({
      quantity: item.quantity,
      unitCost: item.unitCost,
      discount: lineDiscount,
      tax: lineTax,
      total: lineTotal,
      remarks: item.remarks,
      product: { connect: { id: product.id } },
    });
  }

  const total = subtotal - totalDiscount + totalTax;
  const purchaseOrderNumber = await generateDocumentNumber(DocumentType.PURCHASE_ORDER);

  // ✅ Convert string date to Date object
  const expectedDeliveryDate = data.expectedDeliveryDate
    ? new Date(data.expectedDeliveryDate)
    : undefined;

  return repository.create({
    purchaseOrderNumber,
    subtotal,
    discount: totalDiscount,
    tax: totalTax,
    total,
    notes: data.notes,
    supplierReference: data.supplierReference,
    expectedDeliveryDate,  // ← now it's a Date or undefined
    deliveryAddress: data.deliveryAddress,
    warehouse: { connect: { id: data.warehouseId } },
    supplier: { connect: { id: supplier.id } },
    createdBy: { connect: { id: userId } },
    items: { create: items },
  });
}
export async function getAll(
  search?: string,
  status?: PurchaseOrderStatus,
  supplierId?: number,
  page = 1,
  limit = 20
) {
  const purchaseOrders = await repository.findAll(search, status, supplierId, page, limit);
  const total = await repository.count(search, status, supplierId);

  return {
    data: purchaseOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOne(
  id: number
) {
  const purchaseOrder =
    await repository.findById(id);

  if (!purchaseOrder) {
    throw new AppError(
      "Purchase Order not found.",
      404
    );
  }

  return purchaseOrder;
}

export async function update(id: number, data: UpdatePurchaseOrderInput) {
  await getOne(id);

  const updateData: Prisma.PurchaseOrderUpdateInput = {};

  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.deliveryAddress !== undefined) updateData.deliveryAddress = data.deliveryAddress;
  if (data.supplierReference !== undefined) updateData.supplierReference = data.supplierReference;

  // ✅ Convert date string to Date object if provided
  if (data.expectedDeliveryDate !== undefined) {
    updateData.expectedDeliveryDate = data.expectedDeliveryDate
      ? new Date(data.expectedDeliveryDate)
      : null; // if empty string, set to null
  }

  return repository.update(id, updateData);
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
  const po = await getOne(id);

  if (
    po.status !== "DRAFT" &&
    po.status !== "PENDING_APPROVAL"
  ) {
    throw new AppError(
      "Only pending purchase orders can be approved.",
      400
    );
  }

  return repository.approve(
    id,
    userId
  );
}

export async function cancel(
  id: number,
  userId: number,
  reason: string
) {
  await getOne(id);

  return repository.cancel(
    id,
    userId,
    reason
  );
}

export async function stats() {
  return repository.getStats();
}