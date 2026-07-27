import prisma from "../../lib/prisma";
import {
  Prisma,
  OrderStatus,
} from "@prisma/client";

export function create(
  data: Prisma.SalesOrderCreateInput
) {
  return prisma.salesOrder.create({
    data,
    include: {
      customer: true,
      createdBy: true,
      quote: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function findById(id: number) {
  return prisma.salesOrder.findFirst({
    where: { id },
    include: {
      customer: true,
      createdBy: true,
      quote: true,
      items: { include: { product: true } },
      invoice: true,   // ✅ Add this line
    },
  });
}

export function findByOrderNumber(
  orderNumber: string
) {
  return prisma.salesOrder.findUnique({
    where: {
      orderNumber,
    },
  });
}

export function getAll(
  search?: string,
  status?: OrderStatus,
  customerId?: number,
  page = 1,
  limit = 20
) {
  return prisma.salesOrder.findMany({
    where: {
       isDeleted: false,
      ...(status && {
        status,
      }),

      ...(customerId && {
        customerId,
      }),

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

    include: {
      customer: true,

      createdBy: true,

      quote: true,
    },

    skip: (page - 1) * limit,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
}

export function update(
  id: number,
  data: Prisma.SalesOrderUpdateInput
) {
  return prisma.salesOrder.update({
    where: {
      id,
    },

    data,

    include: {
      customer: true,

      createdBy: true,

      quote: true,

      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function deleteOrder(id: number) {
  return prisma.salesOrder.delete({
    where: {
      id,
    },
  });
}

export function updateStatus(
  id: number,
  status: OrderStatus
) {
  return prisma.salesOrder.update({
    where: {
      id,
    },

    data: {
      status,
    },
  });
}
export function restore(id: number) {
  return prisma.salesOrder.update({
    where: { id },
    data: {
      isDeleted: false,
    },
  });
}
export function findDeletedById(id: number) {
  return prisma.salesOrder.findFirst({
    where: {
      id,
      isDeleted: true,
    },
  });
}
export function approve(
  id: number,
  userId: number
) {
  return prisma.salesOrder.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedBy: {
        connect: {
          id: userId,
        },
      },
      approvedAt: new Date(),
    },
  });
}
export function cancel(
  id: number,
  userId: number,
  reason: string
) {
  return prisma.salesOrder.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledBy: {
        connect: {
          id: userId,
        },
      },
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
  });
}

export async function getStats() {
  const [
    totalOrders,
    pending,
    approved,
    processing,
    readyForLoading,
    loaded,
    dispatched,
    delivered,
    cancelled,
  ] = await Promise.all([
    prisma.salesOrder.count(),

    prisma.salesOrder.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "PROCESSING",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "READY_FOR_LOADING",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "LOADED",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "DISPATCHED",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "DELIVERED",
      },
    }),

    prisma.salesOrder.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    totalOrders,
    pending,
    approved,
    processing,
    readyForLoading,
    loaded,
    dispatched,
    delivered,
    cancelled,
  };
}
