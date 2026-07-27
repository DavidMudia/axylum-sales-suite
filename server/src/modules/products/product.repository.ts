import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.ProductCreateInput
) {
  return prisma.product.create({
    data,

    include: {
      createdBy: true,
      updatedBy: true,
      inventories: true,
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
  
  page = 1,
  limit = 20
) {
  return prisma.product.findMany({
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
            productNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

    },

    include: {
      inventories: true,
      createdBy: true,
      updatedBy: true,
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
| Count
|--------------------------------------------------------------------------
*/

export function count(
  search?: string,
  
) {
  return prisma.product.count({
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
            productNumber: {
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
| Find By ID
|--------------------------------------------------------------------------
*/

export function findById(id: number) {
  return prisma.product.findUnique({
    where: {
      id,
    },

    include: {
  
      inventories: true,
      createdBy: true,
      updatedBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By Number
|--------------------------------------------------------------------------
*/

export function findByProductNumber(
  productNumber: string
) {
  return prisma.product.findUnique({
    where: {
      productNumber,
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
  return prisma.product.findFirst({
    where: {
      name,
      isDeleted: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.ProductUpdateInput
) {
  return prisma.product.update({
    where: {
      id,
    },

    data,

    include: {
      inventories: true,
      createdBy: true,
      updatedBy: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export function softDelete(
  id: number
) {
  return prisma.product.update({
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
  return prisma.product.update({
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
| Low Stock
|--------------------------------------------------------------------------
*/

export async function getLowStockProducts() {

    const products = await prisma.product.findMany({

        where:{
            isDeleted:false
        },

        include: {
    
  
    createdBy: true,
    updatedBy: true,
    inventories: true,
}

    });

    return products.filter(
    product =>
        Number(product.currentStock) <=
        Number(product.minimumStock)
);

}