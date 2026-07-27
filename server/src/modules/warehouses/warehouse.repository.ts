import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.WarehouseCreateInput
) {
  return prisma.warehouse.create({
    data,
  });
}

/*
|--------------------------------------------------------------------------
| Find All Warehouses
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  page = 1,
  limit = 20
) {
  return prisma.warehouse.findMany({
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
            code: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            state: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    include: {
      _count: {
        select: {
          inventories: true,
          purchaseOrders: true,
          goodsReceipts: true,
          stockCounts: true,
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
| Dashboard
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Count Warehouses
|--------------------------------------------------------------------------
*/

export function count(
  search?: string
) {
  return prisma.warehouse.count({
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
            code: {
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
| Find Warehouse By ID
|--------------------------------------------------------------------------
*/

export function findById(id: number) {
  return prisma.warehouse.findUnique({
    where: {
      id,
    },

    include: {
      inventories: {
        include: {
          product: {
            include: {
             
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },

      purchaseOrders: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },

      goodsReceipts: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },

      stockCounts: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });
}
/*
|--------------------------------------------------------------------------
| Find By Code
|--------------------------------------------------------------------------
*/

export function findByCode(
  code: string
) {
  return prisma.warehouse.findUnique({
    where: {
      code,
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
  return prisma.warehouse.findFirst({
    where: {
      name,
      isDeleted: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Warehouse
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.WarehouseUpdateInput
) {
  return prisma.warehouse.update({
    where: {
      id,
    },

    data,
  });
}

/*
|--------------------------------------------------------------------------
| Activate Warehouse
|--------------------------------------------------------------------------
*/

export function activate(
  id: number
) {
  return prisma.warehouse.update({
    where: {
      id,
    },

    data: {
      status: "ACTIVE",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Deactivate Warehouse
|--------------------------------------------------------------------------
*/

export function deactivate(
  id: number
) {
  return prisma.warehouse.update({
    where: {
      id,
    },

    data: {
      status: "INACTIVE",
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
  return prisma.warehouse.update({
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
| Restore
|--------------------------------------------------------------------------
*/

export function restore(
  id: number
) {
  return prisma.warehouse.update({
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
| Warehouse Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {
  const [
    total,
    active,
    inactive,
    warehouses,
  ] = await Promise.all([

    prisma.warehouse.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.warehouse.count({
      where: {
        status: "ACTIVE",
        isDeleted: false,
      },
    }),

    prisma.warehouse.count({
      where: {
        status: "INACTIVE",
        isDeleted: false,
      },
    }),

    prisma.warehouse.findMany({
      where: {
        isDeleted: false,
      },

      include: {
        _count: {
          select: {
            inventories: true,
            purchaseOrders: true,
            goodsReceipts: true,
            stockCounts: true,
          },
        },
      },
    }),

  ]);

  const totalInventoryRecords =
    warehouses.reduce(
      (sum, warehouse) =>
        sum +
        warehouse._count.inventories,
      0
    );

  const totalPurchaseOrders =
    warehouses.reduce(
      (sum, warehouse) =>
        sum +
        warehouse._count.purchaseOrders,
      0
    );

  const totalGoodsReceipts =
    warehouses.reduce(
      (sum, warehouse) =>
        sum +
        warehouse._count.goodsReceipts,
      0
    );

  const totalStockCounts =
    warehouses.reduce(
      (sum, warehouse) =>
        sum +
        warehouse._count.stockCounts,
      0
    );

  return {

    totalWarehouses: total,

    activeWarehouses: active,

    inactiveWarehouses: inactive,

    totalInventoryRecords,

    totalPurchaseOrders,

    totalGoodsReceipts,

    totalStockCounts,

  };
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function getDashboard() {
  const warehouses = await prisma.warehouse.findMany({
    where: {
      isDeleted: false,
    },

    include: {
      inventories: {
        include: {
          product: true,
        },
      },

      _count: {
        select: {
          inventories: true,
          purchaseOrders: true,
          goodsReceipts: true,
          stockCounts: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  const summary = {
    totalWarehouses: warehouses.length,

    activeWarehouses: warehouses.filter(
      (w) => w.status === "ACTIVE"
    ).length,

    inactiveWarehouses: warehouses.filter(
      (w) => w.status === "INACTIVE"
    ).length,

    inventoryRecords: warehouses.reduce(
      (sum, w) => sum + w._count.inventories,
      0
    ),

    purchaseOrders: warehouses.reduce(
      (sum, w) => sum + w._count.purchaseOrders,
      0
    ),

    goodsReceipts: warehouses.reduce(
      (sum, w) => sum + w._count.goodsReceipts,
      0
    ),

    stockCounts: warehouses.reduce(
      (sum, w) => sum + w._count.stockCounts,
      0
    ),

    inventoryValue: warehouses.reduce(
      (sum, warehouse) =>
        sum +
        warehouse.inventories.reduce(
          (total, inventory) =>
            total +
            Number(
              inventory.quantity
            ) *
            Number(
              inventory.product.costPrice
            ),
          0
        ),
      0
    ),
  };

  return {
    summary,

    warehouses: warehouses.map(
      (warehouse) => ({
        id: warehouse.id,

        name: warehouse.name,

        code: warehouse.code,

        status: warehouse.status,

        managerName:
          warehouse.managerName,

        city: warehouse.city,

        state: warehouse.state,

        isPrimary:
          warehouse.isPrimary,

        inventoryRecords:
          warehouse._count
            .inventories,

        purchaseOrders:
          warehouse._count
            .purchaseOrders,

        goodsReceipts:
          warehouse._count
            .goodsReceipts,

        stockCounts:
          warehouse._count
            .stockCounts,

        inventoryValue:
          warehouse.inventories.reduce(
            (sum, inventory) =>
              sum +
              Number(
                inventory.quantity
              ) *
              Number(
                inventory.product
                  .costPrice
              ),
            0
          ),
      })
    ),
  };
}