import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.CustomerCreateInput
) {
  return prisma.customer.create({
    data,

    include: {
      createdBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find All Customers
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  page = 1,
  limit = 20
) {
  return prisma.customer.findMany({
    where: {
      isDeleted: false,

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            companyName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            customerNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    include: {
      createdBy: true,
    },

    orderBy: {
      name: "asc",
    },

    skip: (page - 1) * limit,

    take: limit,
  });
}

/*
|--------------------------------------------------------------------------
| Count Customers
|--------------------------------------------------------------------------
*/

export function count(
  search?: string
) {
  return prisma.customer.count({
    where: {
      isDeleted: false,

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            companyName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            customerNumber: {
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
| Find Customer By ID
|--------------------------------------------------------------------------
*/

export function findById(
  id: number
) {
  return prisma.customer.findUnique({
    where: {
      id,
    },

    include: {
      createdBy: true,

      quotes: true,

      salesOrders: true,

      invoices: true,

      payments: true,

      refunds: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find Customer By Number
|--------------------------------------------------------------------------
*/

export function findByCustomerNumber(
  customerNumber: string
) {
  return prisma.customer.findUnique({
    where: {
      customerNumber,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find Customer By Name
|--------------------------------------------------------------------------
*/

export function findByName(
  name: string
) {
  return prisma.customer.findFirst({
    where: {
      name,

      isDeleted: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.CustomerUpdateInput
) {
  return prisma.customer.update({
    where: {
      id,
    },

    data,

    include: {
      createdBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export function softDelete(
  id: number
) {
  return prisma.customer.update({
    where: {
      id,
    },

    data: {
      isDeleted: true,

      status: "INACTIVE",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Restore Customer
|--------------------------------------------------------------------------
*/

export function restore(
  id: number
) {
  return prisma.customer.update({
    where: {
      id,
    },

    data: {
      isDeleted: false,

      status: "ACTIVE",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Customer Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {

  const [
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    blockedCustomers,
    totalOutstanding,
  ] = await Promise.all([

    prisma.customer.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.customer.count({
      where: {
        status: "ACTIVE",
        isDeleted: false,
      },
    }),

    prisma.customer.count({
      where: {
        status: "INACTIVE",
        isDeleted: false,
      },
    }),

    prisma.customer.count({
      where: {
        status: "BLOCKED",
        isDeleted: false,
      },
    }),

    prisma.customer.aggregate({
      _sum: {
        outstandingBalance: true,
      },
      where: {
        isDeleted: false,
      },
    }),

  ]);

  return {

    totalCustomers,

    activeCustomers,

    inactiveCustomers,

    blockedCustomers,

    totalOutstanding:
      Number(
        totalOutstanding._sum
          .outstandingBalance ?? 0
      ),

  };
}