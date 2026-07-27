// server/src/modules/payments/payment.repository.ts

import prisma from "../../lib/prisma";
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

export function create(
  db: Prisma.TransactionClient | typeof prisma,
  data: Prisma.PaymentCreateInput
) {
  return db.payment.create({
    data,
    include: {
      customer: true,
      invoice: true,
      createdBy: true,
      approvedBy: true,
    },
  });
}

export function findById(id: number) {
  return prisma.payment.findFirst({
    where: { id },
    include: {
      customer: true,
      invoice: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
      createdBy: true,
      approvedBy: true,
      cancelledBy: true,
    },
  });
}

export function getAll(
  search?: string,
  status?: PaymentStatus,
  method?: PaymentMethod,
  customerId?: number,
  refundable = false,
  page = 1,
  limit = 20
) {
  return prisma.payment.findMany({
    where: {
      ...(status && {
        status,
      }),

      ...(method && {
        paymentMethod: method,
      }),

      ...(customerId && {
        customerId,
      }),

      // Only payments that can still be refunded
      ...(refundable && {
        status: PaymentStatus.COMPLETED,

        amount: {
          gt: prisma.payment.fields.refundedAmount,
        },
      }),

      ...(search && {
        OR: [
          {
            paymentNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            receiptNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            transactionId: {
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
        ],
      }),
    },

    include: {
      customer: true,
      invoice: true,
      approvedBy: true,
      createdBy: true,
      cancelledBy: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * limit,

    take: limit,
  });
}

export function update(
  id: number,
  data: Prisma.PaymentUpdateInput
) {
  return prisma.payment.update({
    where: {
      id,
    },

    data,

    include: {
      customer: true,
      invoice: true,
      approvedBy: true,
      createdBy: true,
      cancelledBy: true,
    },
  });
}

export function approve(
  id: number,
  userId: number
) {
  return prisma.payment.update({
    where: {
      id,
    },

    data: {
      status: PaymentStatus.COMPLETED,

      approvedAt: new Date(),

      approvedBy: {
        connect: {
          id: userId,
        },
      },
    },

    include: {
      customer: true,
      invoice: true,
      approvedBy: true,
      createdBy: true,
    },
  });
}

export function cancel(id: number) {
  return prisma.payment.update({
    where: {
      id,
    },

    data: {
      status: PaymentStatus.CANCELLED,
    },
  });
}

export async function getStats() {
  const [
    totalPayments,
    completedPayments,
    pendingPayments,
    failedPayments,
    cancelledPayments,
    totalAmount,
  ] = await Promise.all([
    prisma.payment.count(),

    prisma.payment.count({
      where: {
        status: PaymentStatus.COMPLETED,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.PENDING,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.FAILED,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.CANCELLED,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.COMPLETED,
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalPayments,
    completedPayments,
    pendingPayments,
    failedPayments,
    cancelledPayments,
    totalRevenue: Number(totalAmount._sum.amount ?? 0),
  };
}
export function count(
  search?: string,
  status?: PaymentStatus,
  method?: PaymentMethod,
  customerId?: number,
  refundable = false
) {
  return prisma.payment.count({
    where: {
      ...(status && { status }),
      ...(method && { paymentMethod: method }),
      ...(customerId && { customerId }),

      ...(refundable && {
        status: PaymentStatus.COMPLETED,
        amount: {
          gt: prisma.payment.fields.refundedAmount,
        },
      }),

      ...(search && {
        OR: [
          {
            paymentNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            receiptNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            transactionId: {
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
        ],
      }),
    },
  });
}