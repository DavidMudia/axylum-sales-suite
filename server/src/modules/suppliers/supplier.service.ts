import prisma from "../../lib/prisma";

import { Prisma } from "@prisma/client";

import { AppError } from "../../utils/AppError";

import * as repository from "./supplier.repository";

/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/

export async function create(
  data: Prisma.SupplierCreateInput
) {
  const existing =
    await repository.findByName(
      data.name as string
    );

  if (existing) {
    throw new AppError(
      "Supplier already exists.",
      400
    );
  }

  return repository.create(data);
}

/*
|--------------------------------------------------------------------------
| Get All Suppliers
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  page = 1,
  limit = 20
) {
  const suppliers =
    await repository.findAll(
      search,
      page,
      limit
    );

  const total =
    await repository.count(search);

  return {
    data: suppliers,

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
| Get Supplier
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {
  const supplier =
    await repository.findById(id);

  if (!supplier) {
    throw new AppError(
      "Supplier not found.",
      404
    );
  }

  return supplier;
}

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

export async function update(
  id: number,
  data: Prisma.SupplierUpdateInput
) {
  await getOne(id);

  if (data.name) {
    const existing =
      await repository.findByName(
        data.name as string
      );

    if (
      existing &&
      existing.id !== id
    ) {
      throw new AppError(
        "Supplier with this name already exists.",
        400
      );
    }
  }

  return repository.update(
    id,
    data
  );
}

/*
|--------------------------------------------------------------------------
| Delete Supplier
|--------------------------------------------------------------------------
*/

export async function remove(
  id: number
) {
  const supplier =
    await getOne(id);

  if (
    supplier.purchaseOrders.length >
    0
  ) {
    throw new AppError(
      "Supplier has purchase orders and cannot be deleted.",
      400
    );
  }

  if (
    supplier.goodsReceipts.length >
    0
  ) {
    throw new AppError(
      "Supplier has goods receipts and cannot be deleted.",
      400
    );
  }

  return repository.softDelete(id);
}

/*
|--------------------------------------------------------------------------
| Restore Supplier
|--------------------------------------------------------------------------
*/

export async function restore(
  id: number
) {
  await getOne(id);

  return repository.restore(id);
}

/*
|--------------------------------------------------------------------------
| Supplier Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}
// server/src/modules/suppliers/supplier.service.ts
// import prisma from "../../lib/prisma";

// ... existing functions

export async function getStats(id: number) {
  // First, get the supplier to ensure it exists
  const supplier = await prisma.supplier.findUnique({
    where: { id, isDeleted: false },
    include: {
      purchaseOrders: {
        where: { isDeleted: false },
        select: { id: true },
      },
      goodsReceipts: {
        where: { isDeleted: false },
        include: {
          items: {
            select: { acceptedQuantity: true },
          },
        },
      },
    },
  });

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  const totalPurchaseOrders = supplier.purchaseOrders.length;
  const totalGoodsReceipts = supplier.goodsReceipts.length;

  // Sum all accepted quantities from all receipts
  let totalItemsReceived = 0;
  supplier.goodsReceipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
      totalItemsReceived += item.acceptedQuantity;
    });
  });

  // Monthly breakdown for the last 12 months
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago

  const monthlyData = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM') as month,
      COUNT(*)::int as count
    FROM "GoodsReceipt"
    WHERE "supplierId" = ${id}
      AND "createdAt" >= ${startDate}
      AND "isDeleted" = false
    GROUP BY month
    ORDER BY month DESC
  `;

  // Convert bigint to number
  const monthlyReceipts = monthlyData.map((row) => ({
    month: row.month,
    count: Number(row.count),
  }));

  return {
    totalPurchaseOrders,
    totalGoodsReceipts,
    totalItemsReceived,
    monthlyReceipts,
  };
}