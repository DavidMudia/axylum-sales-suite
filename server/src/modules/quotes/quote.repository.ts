import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export function create(data: Prisma.QuoteCreateInput) {
  return prisma.quote.create({
    data,
    include: {
      customer: true,
      createdBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function findById(id: number) {
  return prisma.quote.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      customer: true,
      createdBy: true,
      approvedBy: true,
      rejectedBy: true,
      salesOrders: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export function findByQuoteNumber(quoteNumber: string) {
  return prisma.quote.findFirst({
    where: {
      quoteNumber,
      isDeleted: false,
    },
  });
}

export function getAll(
  search?: string,
  status?: string,
  page = 1,
  limit = 20
) {
  return prisma.quote.findMany({
    where: {
      isDeleted: false,

      ...(status && {
        status: status as any,
      }),

      ...(search && {
        OR: [
          {
            quoteNumber: {
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

export function update(
  id: number,
  data: Prisma.QuoteUpdateInput
) {
  return prisma.quote.update({
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

export function softDelete(id: number) {
  return prisma.quote.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export function approve(
  id: number,
  approvedById: number
) {
  return prisma.quote.update({
    where: {
      id,
    },
    data: {
      status: "ACCEPTED",
      approvedAt: new Date(),
      approvedBy: {
        connect: {
          id: approvedById,
        },
      },
    },
  });
}

export function reject(
  id: number,
  rejectedById: number,
  note: string
) {
  return prisma.quote.update({
    where: {
      id,
    },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      approvalNote: note,
      rejectedBy: {
        connect: {
          id: rejectedById,
        },
      },
    },
  });
}

export function getStats() {
  return Promise.all([
    prisma.quote.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.quote.count({
      where: {
        status: "DRAFT",
        isDeleted: false,
      },
    }),

    prisma.quote.count({
      where: {
        status: "SENT",
        isDeleted: false,
      },
    }),

    prisma.quote.count({
      where: {
        status: "ACCEPTED",
        isDeleted: false,
      },
    }),

    prisma.quote.count({
      where: {
        status: "REJECTED",
        isDeleted: false,
      },
    }),

    prisma.quote.aggregate({
      where: {
        isDeleted: false,
      },
      _sum: {
        total: true,
      },
    }),
  ]).then(
    ([
      totalQuotes,
      draftQuotes,
      sentQuotes,
      acceptedQuotes,
      rejectedQuotes,
      totalValue,
    ]) => ({
      totalQuotes,
      draftQuotes,
      sentQuotes,
      acceptedQuotes,
      rejectedQuotes,
      totalValue: totalValue._sum.total ?? 0,
    })
  );
}
export function restore(id: number) {
  return prisma.quote.update({
    where: { id },
    data: {
      isDeleted: false,
    },
  });
}