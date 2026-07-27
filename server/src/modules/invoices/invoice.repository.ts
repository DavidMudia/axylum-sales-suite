import prisma from "../../lib/prisma";
import {
  Prisma,
  InvoiceStatus,
} from "@prisma/client";

export function create(data: Prisma.InvoiceCreateInput) {
  return prisma.invoice.create({
    data,
    include: {
      customer: true,
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      approvedBy: { select: { id: true, firstName: true, lastName: true } },
      items: { include: { product: true } },
      payments: true,
      salesOrder: true,   // ✅ added
      waybills: true,
    },
  });
}


export function getAll(
  search?: string,
  status?: InvoiceStatus,
  page = 1,
  limit = 20
) {
  return prisma.invoice.findMany({
    where: {
      isDeleted: false,

      ...(status && {
        status,
      }),

      ...(search && {
        OR: [
          {
            invoiceNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            verificationCode: {
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
              phone: {
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

      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },

      payments: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * limit,

    take: limit,
  });
}

export function findById(id: number) {
  return prisma.invoice.findFirst({
    where: { id, isDeleted: false },
    include: {
      customer: true,
      createdBy: true,
      approvedBy: true,
      items: { include: { product: true } },
      payments: true,
      waybills: true,
      refunds: true,
      salesOrder: true,   // ✅ added
    },
  });
}
export function update(
  id: number,
  data: Prisma.InvoiceUpdateInput
) {
  return prisma.invoice.update({
    where: {
      id,
    },

    data,

    include: {
      customer: true,

      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function softDelete(
  id: number
) {
  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      isDeleted: true,
    },
  });
}

export function restore(
  id: number
) {
  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      isDeleted: false,
    },
  });
}

export function approve(
  id: number,
  userId: number,
  note?: string
) {
  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      approvedBy: {
        connect: {
          id: userId,
        },
      },

      approvedAt: new Date(),

      approvalNote: note,
    },
  });
}

export function markPrinted(
  id: number
) {
  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      isPrinted: true,

      printedAt: new Date(),
    },
  });
}

export function getStats() {
  return Promise.all([
    prisma.invoice.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.invoice.count({
      where: {
        status: "UNPAID",
        isDeleted: false,
      },
    }),

    prisma.invoice.count({
      where: {
        status: "PARTIAL",
        isDeleted: false,
      },
    }),

    prisma.invoice.count({
      where: {
        status: "PAID",
        isDeleted: false,
      },
    }),

    prisma.invoice.aggregate({
      where: {
        isDeleted: false,
      },

      _sum: {
        total: true,
      },
    }),
  ]).then(
    ([
      totalInvoices,
      unpaid,
      partial,
      paid,
      totals,
    ]) => ({
      totalInvoices,

      unpaid,

      partial,

      paid,

      totalRevenue:
        totals._sum.total ?? 0,
    })
  );
}