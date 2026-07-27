import prisma from "../../lib/prisma";
import {
  Prisma,
  AuditModule,
} from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.AuditLogCreateInput
) {
  return prisma.auditLog.create({
    data,

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/

export function findById(
  id: number
) {
  return prisma.auditLog.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  module?: AuditModule,
  userId?: number,
  page = 1,
  limit = 20
) {
  return prisma.auditLog.findMany({

    where: {

      ...(module && {
        module,
      }),

      ...(userId && {
        userId,
      }),

      ...(search && {

        OR: [

          {
            action: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            recordNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            recordId: {
              contains: search,
              mode: "insensitive",
            },
          },

        ],

      }),

    },

    include: {

      user: {

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
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

/*
|--------------------------------------------------------------------------
| Count
|--------------------------------------------------------------------------
*/

export function count(
  search?: string,
  module?: AuditModule,
  userId?: number
) {
  return prisma.auditLog.count({

    where: {

      ...(module && {
        module,
      }),

      ...(userId && {
        userId,
      }),

      ...(search && {

        OR: [

          {
            action: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            recordNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            recordId: {
              contains: search,
              mode: "insensitive",
            },
          },

        ],

      }),

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
    total,
    payment,
    refunds,
    waybills,
    purchaseOrders,
    goodsReceipts,
    inventoryCounts,
  ] = await Promise.all([

    prisma.auditLog.count(),

    prisma.auditLog.count({
      where: {
        module: "PAYMENT",
      },
    }),

    prisma.auditLog.count({
      where: {
        module: "REFUND",
      },
    }),

    prisma.auditLog.count({
      where: {
        module: "WAYBILL",
      },
    }),

    prisma.auditLog.count({
      where: {
        module: "PURCHASE_ORDER",
      },
    }),

    prisma.auditLog.count({
      where: {
        module: "GOODS_RECEIPT",
      },
    }),

    prisma.auditLog.count({
      where: {
        module: "INVENTORY_COUNT",
      },
    }),

  ]);

  return {

    totalLogs: total,

    paymentLogs: payment,

    refundLogs: refunds,

    waybillLogs: waybills,

    purchaseOrderLogs: purchaseOrders,

    goodsReceiptLogs: goodsReceipts,

    inventoryCountLogs: inventoryCounts,

  };

}