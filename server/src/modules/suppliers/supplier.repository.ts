import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.SupplierCreateInput
) {
  return prisma.supplier.create({
    data,

    include: {
      createdBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find All Suppliers
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  page = 1,
  limit = 20
) {
  return prisma.supplier.findMany({
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
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    include: {
      createdBy: true,

      _count: {
        select: {
          purchaseOrders: true,
          goodsReceipts: true,
        },
      },
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
| Count Suppliers
|--------------------------------------------------------------------------
*/

export function count(
  search?: string
) {
  return prisma.supplier.count({
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
            },
          },
        ],
      }),
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find Supplier By ID
|--------------------------------------------------------------------------
*/

export function findById(
  id: number
) {
  return prisma.supplier.findUnique({
    where: {
      id,
    },

    include: {
      createdBy: true,

      purchaseOrders: {
        where: {
          isDeleted: false,
        },
      },

      goodsReceipts: {
        where: {
          isDeleted: false,
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/

export function findByName(
  name: string
) {
  return prisma.supplier.findFirst({
    where: {
      name,
      isDeleted: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.SupplierUpdateInput
) {
  return prisma.supplier.update({
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
  return prisma.supplier.update({
    where: {
      id,
    },

    data: {
      isDeleted: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Restore Supplier
|--------------------------------------------------------------------------
*/

export function restore(
  id: number
) {
  return prisma.supplier.update({
    where: {
      id,
    },

    data: {
      isDeleted: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Supplier Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {
  const [
    total,
    active,
    inactive,
    suppliers,
  ] = await Promise.all([
    prisma.supplier.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.supplier.count({
      where: {
        status: "ACTIVE",
        isDeleted: false,
      },
    }),

    prisma.supplier.count({
      where: {
        status: "INACTIVE",
        isDeleted: false,
      },
    }),

    prisma.supplier.findMany({
      where: {
        isDeleted: false,
      },

      include: {
        _count: {
          select: {
            purchaseOrders: true,
            goodsReceipts: true,
          },
        },
      },
    }),
  ]);

  const totalPurchaseOrders =
    suppliers.reduce(
      (sum, supplier) =>
        sum + supplier._count.purchaseOrders,
      0
    );

  const totalReceipts =
    suppliers.reduce(
      (sum, supplier) =>
        sum + supplier._count.goodsReceipts,
      0
    );

  return {
    totalSuppliers: total,

    activeSuppliers: active,

    inactiveSuppliers: inactive,

    totalPurchaseOrders,

    totalGoodsReceipts: totalReceipts,
  };
}