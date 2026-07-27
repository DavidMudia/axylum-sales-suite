import prisma from "../../lib/prisma";

import { Prisma, RefundStatus } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function create(
  db: Prisma.TransactionClient | typeof prisma,
  data: Prisma.RefundCreateInput
) {
  return db.refund.create({
    data,

    include: {
      payment: true,
      invoice: true,
      customer: true,
      processedBy: true,
      approvedBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/

export function findById(id: number) {
  return prisma.refund.findUnique({
    where: { id },

    include: {
      payment: true,
      invoice: true,
      customer: true,
      processedBy: true,
      approvedBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export function getAll(
  search?: string,
  status?: RefundStatus,
  customerId?: number,
  page = 1,
  limit = 20
) {
  return prisma.refund.findMany({
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

    include: {
      payment: true,
      invoice: true,
      customer: true,
      processedBy: true,
      approvedBy: true,
    },

    skip: (page - 1) * limit,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function update(
  db: Prisma.TransactionClient | typeof prisma,
  id: number,
  data: Prisma.RefundUpdateInput
) {
  return db.refund.update({
    where: { id },

    data,

    include: {
      payment: true,
      invoice: true,
      customer: true,
      processedBy: true,
      approvedBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {
  const [
    totalRefunds,
    pending,
    approved,
    totalAmount,
  ] = await Promise.all([
    prisma.refund.count(),

    prisma.refund.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.refund.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.refund.aggregate({
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalRefunds,

    pending,

    approved,

    totalAmount:
      totalAmount._sum.amount ?? 0,
  };
}