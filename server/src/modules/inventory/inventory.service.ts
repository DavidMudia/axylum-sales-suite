import prisma from "../../lib/prisma";

import { Prisma,MovementType,InventoryReferenceType } from "@prisma/client";
import {
  logInventory,
} from "../audit-log/audit-log.service";
import { AppError } from "../../utils/AppError";

import * as repository from "./inventory.repository";

import { AdjustInventoryInput } from "./inventory.schema";

/*
|--------------------------------------------------------------------------
| Get All Inventory
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  page = 1,
  limit = 20
) {
  const inventory =
    await repository.findAll(
      search,
      page,
      limit
    );

  const total =
    await repository.count(search);

  return {
    data: inventory,

    pagination: {
      page,
      limit,
      total,

      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}

/*
|--------------------------------------------------------------------------
| Get One Inventory
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {
  const inventory =
    await repository.findById(id);

  if (!inventory) {
    throw new AppError(
      "Inventory record not found.",
      404
    );
  }

  return inventory;
}

/*
|--------------------------------------------------------------------------
| Adjust Inventory
|--------------------------------------------------------------------------
*/

export async function adjust(
  id: number,
  data: AdjustInventoryInput,
  userId: number
) {
  const inventory =
    await getOne(id);

  const currentQuantity =
    Number(inventory.quantity);

  const adjustment =
    Number(data.quantity);

  const newQuantity =
    currentQuantity + adjustment;

  if (newQuantity < 0) {
    throw new AppError(
      "Insufficient stock.",
      400
    );
  }

  return prisma.$transaction(async (tx) => {

  const updatedInventory =
    await tx.inventory.update({

      where: {
        id,
      },

      data: {
        quantity: newQuantity,
      },

      include: {
        product: true,
      },
    });

  await tx.product.update({

    where: {
      id: inventory.productId,
    },

    data: {
      currentStock: newQuantity,
    },
  });

  await tx.inventoryMovement.create({

  data: {

    inventory: {
      connect: {
        id: inventory.id,
      },
    },

    quantity: adjustment,

    quantityBefore: currentQuantity,

    quantityAfter: newQuantity,

    movementType: MovementType.ADJUSTMENT,

    referenceType: InventoryReferenceType.STOCK_COUNT,

    referenceId: inventory.id,

    remarks: data.reason,

    createdBy: {
      connect: {
        id: userId,
      },
    },

  },

});

  return updatedInventory;
});
}

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/

export async function lowStock() {

  const inventory =
    await repository.getAllInventory();

  return inventory.filter(

    (item) =>

      Number(item.quantity) <=
      Number(
        item.product.minimumStock
      )

  );
}

/*
|--------------------------------------------------------------------------
| Out Of Stock
|--------------------------------------------------------------------------
*/

export async function outOfStock() {

  return repository.getOutOfStock();

}

/*
|--------------------------------------------------------------------------
| Movement History
|--------------------------------------------------------------------------
*/

export async function history(
  productId: number
) {

  return repository.getHistory(
    productId
  );

}
/*
|--------------------------------------------------------------------------
| Inventory Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}
/*
|--------------------------------------------------------------------------
| Reserve Stock
|--------------------------------------------------------------------------
*/

export async function reserveStock(
  id: number,
  quantity: number,
  userId: number,
   referenceType: InventoryReferenceType,
  referenceId: number
) {
  const inventory =
    await getOne(id);

  if (quantity <= 0) {
    throw new AppError(
      "Quantity must be greater than zero.",
      400
    );
  }

  const available =
    Number(inventory.quantity);

  if (available < quantity) {
    throw new AppError(
      "Insufficient stock available.",
      400
    );
  }

  const before =
    Number(inventory.quantity);

  const after =
    before - quantity;

  return prisma.$transaction(async (tx) => {

    const updated =
      await tx.inventory.update({

        where: { id },

        data: {
          quantity: after,
        },

        include: {
          product: true,
        },

      });

    await tx.product.update({

      where: {
        id: inventory.productId,
      },

      data: {
        currentStock: after,
        reservedStock: {
          increment: quantity,
        },
      },

    });

    await tx.inventoryMovement.create({

      data: {

        inventoryId: inventory.id,

        quantity,

        quantityBefore: before,

        quantityAfter: after,

        movementType:
          MovementType.RESERVED,

        referenceType,

       referenceId,

        createdById: userId,

      },

    });

    return updated;

  });

}
/*
|--------------------------------------------------------------------------
| Release Reserved Stock
|--------------------------------------------------------------------------
*/

export async function releaseStock(
  id: number,
  quantity: number,
  userId: number,
  referenceType: InventoryReferenceType,
  referenceId: number
) {
  const inventory =
    await getOne(id);

  const product =
    await prisma.product.findUnique({

      where: {
        id: inventory.productId,
      },

    });

  if (!product) {
    throw new AppError(
      "Product not found.",
      404
    );
  }

  if (
    Number(product.reservedStock) <
    quantity
  ) {
    throw new AppError(
      "Reserved quantity is too low.",
      400
    );
  }

  const before =
    Number(inventory.quantity);

  const after =
    before + quantity;

  return prisma.$transaction(async (tx) => {

    const updated =
      await tx.inventory.update({

        where: { id },

        data: {
          quantity: after,
        },

        include: {
          product: true,
        },

      });

    await tx.product.update({

      where: {
        id: product.id,
      },

      data: {

        currentStock: after,

        reservedStock: {
          decrement: quantity,
        },

      },

    });

    await tx.inventoryMovement.create({

      data: {

        inventoryId: inventory.id,

        quantity,

        quantityBefore: before,

        quantityAfter: after,

        movementType:
          MovementType.RELEASED,

        referenceType,

        referenceId,

        createdById: userId,

      },

    });

    return updated;

  });

}
/*
|--------------------------------------------------------------------------
| Transfer Inventory
|--------------------------------------------------------------------------
*/

export async function transfer(
  _data: unknown,
  _userId: number
) {
  throw new AppError(
    "Inventory transfers are not available until warehouse locations are implemented.",
    501
  );
}
