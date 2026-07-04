import prisma from "../../lib/prisma";
import { CreateProductInput } from "./product.schema";

export async function create(
  data: CreateProductInput,
  userId: number
) {
  return prisma.product.create({
    data: {
      ...data,
      createdById: userId,
    },
  });
}

export async function getAll(
  search?: string,
  page = 1,
  limit = 10
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
            sku: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    skip: (page - 1) * limit,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOne(id: number) {
  return prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });
}

export async function update(
  id: number,
  data: Partial<CreateProductInput>
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function remove(id: number) {
  return prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
}

export async function stats() {
  const total = await prisma.product.count({
    where: {
      isDeleted: false,
    },
  });

  const inStock = await prisma.product.count({
    where: {
      status: "IN_STOCK",
      isDeleted: false,
    },
  });

  const lowStock = await prisma.product.count({
    where: {
      status: "LOW_STOCK",
      isDeleted: false,
    },
  });

  const out = await prisma.product.count({
    where: {
      status: "OUT_OF_STOCK",
      isDeleted: false,
    },
  });

  return {
    totalProducts: total,
    inStock,
    lowStock,
    outOfStock: out,
  };
}