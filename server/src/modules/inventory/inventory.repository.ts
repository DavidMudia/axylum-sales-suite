import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Find All Inventory
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  page = 1,
  limit = 20
) {
  return prisma.inventory.findMany({
    where: {
      ...(search && {
        product: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              productNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              sku: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    },

    include: {
      product: {
        include: {
          
        
        },
      },
    },

    orderBy: {
      product: {
        name: "asc",
      },
    },

    skip: (page - 1) * limit,

    take: limit,
  });
}

/*
|--------------------------------------------------------------------------
| Count Inventory
|--------------------------------------------------------------------------
*/

export function count(search?: string) {
  return prisma.inventory.count({
    where: {
      ...(search && {
        product: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              productNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find Inventory By ID
|--------------------------------------------------------------------------
*/

export function findById(id: number) {
  return prisma.inventory.findUnique({
    where: {
      id,
    },

    include: {
      product: {
        include: {
          
        
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By Product ID
|--------------------------------------------------------------------------
*/

export function findByProduct(
  productId: number
) {
  return prisma.inventory.findFirst({
  where: {
    productId,
  },

  include: {
    product: true,
  },
});
}

/*
|--------------------------------------------------------------------------
| Update Inventory
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.InventoryUpdateInput
) {
  return prisma.inventory.update({
    where: {
      id,
    },

    data,

    include: {
      product: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get All Inventory (For Low Stock Check)
|--------------------------------------------------------------------------
*/

export function getAllInventory() {
  return prisma.inventory.findMany({
    include: {
      product: {
        include: {
         
          
        },
      },
    },
  });
}
/*
|--------------------------------------------------------------------------
| Out Of Stock
|--------------------------------------------------------------------------
*/

export function getOutOfStock() {
  return prisma.inventory.findMany({
    where: {
      quantity: {
        lte: 0,
      },
    },

    include: {
      product: {
        include: {
          
        
        },
      },
    },
  });
}
/*
|--------------------------------------------------------------------------
| Inventory Movement History
|--------------------------------------------------------------------------
*/

export function getHistory(
  productId: number
) {
  return prisma.inventoryMovement.findMany({
  where: {
    inventory: {
      productId,
    },
  },

  include: {
    inventory: {
      include: {
        product: true,
      },
    },
    createdBy: true,
  },

  orderBy: {
    createdAt: "desc",
  },
});
}
/*
|--------------------------------------------------------------------------
| Inventory Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    inventoryItems,
    inventory,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.product.count({
      where: {
        isActive: true,
        isDeleted: false,
      },
    }),

    prisma.product.count({
      where: {
        OR: [
          { isActive: false },
          { isDeleted: true },
        ],
      },
    }),

    prisma.inventory.count(),

    prisma.inventory.findMany({
      include: {
        product: true,
      },
    }),
  ]);

  const totalStock =
    inventory.reduce(
      (sum, item) =>
        sum + Number(item.quantity),
      0
    );

  const inventoryValue =
    inventory.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity) *
          Number(item.product.costPrice),
      0
    );

  const lowStock =
    inventory.filter(
      (item) =>
        Number(item.quantity) <=
        Number(
          item.product.minimumStock
        )
    ).length;

  const outOfStock =
    inventory.filter(
      (item) =>
        Number(item.quantity) <= 0
    ).length;

  return {
    totalProducts,

    activeProducts,

    inactiveProducts,

    inventoryItems,

    totalStock,

    inventoryValue,

    lowStock,

    outOfStock,
  };
}