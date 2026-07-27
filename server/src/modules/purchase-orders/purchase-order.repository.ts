// server/src/modules/purchase-orders/purchase-order.repository.ts
import prisma from "../../lib/prisma";
import { Prisma, PurchaseOrderStatus } from "@prisma/client";

export function create(data: Prisma.PurchaseOrderCreateInput) {
  return prisma.purchaseOrder.create({
    data,
    include: {
      supplier: true,
      warehouse: true,
      createdBy: true,
      approvedBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function findById(id: number) {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      warehouse: true,
      createdBy: true,
      approvedBy: true,
      cancelledBy: true,
      items: {
        include: {
          product: true,
        },
      },
      goodsReceipts: {
        select: {
          id: true,
          receiptNumber: true,
        },
      },
    },
  });
}

export function findAll(
  search?: string,
  status?: PurchaseOrderStatus,
  supplierId?: number,
  page = 1,
  limit = 20
) {
  return prisma.purchaseOrder.findMany({
    where: {
      isDeleted: false,
      ...(status && { status }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          {
            purchaseOrderNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            supplier: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    },
    include: {
      supplier: true,
      warehouse: true,
      createdBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export function count(
  search?: string,
  status?: PurchaseOrderStatus,
  supplierId?: number
) {
  return prisma.purchaseOrder.count({
    where: {
      isDeleted: false,
      ...(status && { status }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          {
            purchaseOrderNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            supplier: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    },
  });
}

export function update(id: number, data: Prisma.PurchaseOrderUpdateInput) {
  return prisma.purchaseOrder.update({
    where: { id },
    data,
    include: {
      supplier: true,
      warehouse: true,
      createdBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function softDelete(id: number) {
  return prisma.purchaseOrder.update({
    where: { id },
    data: { isDeleted: true },
  });
}

export function restore(id: number) {
  return prisma.purchaseOrder.update({
    where: { id },
    data: { isDeleted: false },
  });
}

export function approve(id: number, userId: number) {
  return prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedById: userId,
      approvedAt: new Date(),
    },
    include: {
      supplier: true,
      warehouse: true,
      createdBy: true,
      approvedBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function cancel(id: number, userId: number, reason: string) {
  return prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledById: userId,
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
    include: {
      supplier: true,
      warehouse: true,
      createdBy: true,
      cancelledBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getStats() {
  const [
    totalOrders,
    draft,
    pendingApproval,
    approved,
    partiallyReceived,
    received,
    cancelled,
  ] = await Promise.all([
    prisma.purchaseOrder.count({ where: { isDeleted: false } }),
    prisma.purchaseOrder.count({ where: { status: "DRAFT", isDeleted: false } }),
    prisma.purchaseOrder.count({ where: { status: "PENDING_APPROVAL", isDeleted: false } }),
    prisma.purchaseOrder.count({ where: { status: "APPROVED", isDeleted: false } }),
    prisma.purchaseOrder.count({ where: { status: "PARTIALLY_RECEIVED", isDeleted: false } }),
    prisma.purchaseOrder.count({ where: { status: "RECEIVED", isDeleted: false } }),
    prisma.purchaseOrder.count({ where: { status: "CANCELLED", isDeleted: false } }),
  ]);

  return {
    totalOrders,
    draft,
    pendingApproval,
    approved,
    partiallyReceived,
    received,
    cancelled,
  };
}