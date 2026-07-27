// server/src/modules/goods-receipt/goods-receipt.repository.ts
import prisma from "../../lib/prisma";
import { Prisma, GoodsReceiptStatus } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function create(data: Prisma.GoodsReceiptCreateInput) {
  return prisma.goodsReceipt.create({
    data,
    include: {
      supplier: true,
      warehouse: true,
      purchaseOrder: true,
      receivedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
      verifiedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
      items: {
        include: {
          product: true,
          purchaseOrderItem: true,
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find One
|--------------------------------------------------------------------------
*/

export function findById(id: number) {
  return prisma.goodsReceipt.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      supplier: true,
      warehouse: true,
      purchaseOrder: true,
      receivedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
      verifiedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
      items: {
        include: {
          product: true,
          purchaseOrderItem: true,
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export function getAll(
  search?: string,
  status?: GoodsReceiptStatus,
  warehouseId?: number,
  supplierId?: number,
  page = 1,
  limit = 20
) {
  return prisma.goodsReceipt.findMany({
    where: {
      isDeleted: false,
      ...(status && { status }),
      ...(warehouseId && { warehouseId }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          { receiptNumber: { contains: search, mode: "insensitive" } },
          { supplier: { name: { contains: search, mode: "insensitive" } } },
          { purchaseOrder: { purchaseOrderNumber: { contains: search, mode: "insensitive" } } },
        ],
      }),
    },
    include: {
      supplier: true,
      warehouse: true,
      purchaseOrder: true,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function update(id: number, data: Prisma.GoodsReceiptUpdateInput) {
  return prisma.goodsReceipt.update({
    where: { id },
    data,
    include: { items: true },
  });
}

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

export function verify(id: number, verifiedById: number) {
  return prisma.goodsReceipt.update({
    where: { id },
    data: {
      status: GoodsReceiptStatus.VERIFIED,
      verifiedAt: new Date(),
      verifiedBy: { connect: { id: verifiedById } },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export function softDelete(id: number) {
  return prisma.goodsReceipt.update({
    where: { id },
    data: { isDeleted: true },
  });
}

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export function restore(id: number) {
  return prisma.goodsReceipt.update({
    where: { id },
    data: { isDeleted: false },
  });
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {
  const [totalReceipts, received, verified, cancelled] = await Promise.all([
    prisma.goodsReceipt.count({ where: { isDeleted: false } }),
    prisma.goodsReceipt.count({ where: { status: GoodsReceiptStatus.RECEIVED, isDeleted: false } }),
    prisma.goodsReceipt.count({ where: { status: GoodsReceiptStatus.VERIFIED, isDeleted: false } }),
    prisma.goodsReceipt.count({ where: { status: GoodsReceiptStatus.CANCELLED, isDeleted: false } }),
  ]);

  return { totalReceipts, received, verified, cancelled };
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function dashboard() {
  const receipts = await prisma.goodsReceipt.findMany({
    where: { isDeleted: false },
    include: {
      supplier: true,
      warehouse: true,
      purchaseOrder: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    summary: {
      totalReceipts: receipts.length,
      received: receipts.filter((r) => r.status === GoodsReceiptStatus.RECEIVED).length,
      verified: receipts.filter((r) => r.status === GoodsReceiptStatus.VERIFIED).length,
      cancelled: receipts.filter((r) => r.status === GoodsReceiptStatus.CANCELLED).length,
    },
    receipts,
  };
}