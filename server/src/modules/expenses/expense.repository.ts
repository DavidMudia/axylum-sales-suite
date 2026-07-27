import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export function create(data: Prisma.ExpenseCreateInput) {
  return prisma.expense.create({ data });
}

export function findAll(
  search?: string,
  category?: string,
  startDate?: Date,
  endDate?: Date,
  page = 1,
  limit = 20
) {
  return prisma.expense.findMany({
    where: {
      ...(category && { category: category as any }),
      ...(startDate && { date: { gte: startDate } }),
      ...(endDate && { date: { lte: endDate } }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: "insensitive" } },
          { reference: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { date: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export function count(
  search?: string,
  category?: string,
  startDate?: Date,
  endDate?: Date
) {
  return prisma.expense.count({
    where: {
      ...(category && { category: category as any }),
      ...(startDate && { date: { gte: startDate } }),
      ...(endDate && { date: { lte: endDate } }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: "insensitive" } },
          { reference: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
  });
}

export function findById(id: number) {
  return prisma.expense.findUnique({ where: { id } });
}

export function update(id: number, data: Prisma.ExpenseUpdateInput) {
  return prisma.expense.update({ where: { id }, data });
}

export function remove(id: number) {
  return prisma.expense.delete({ where: { id } });
}

export function getStats() {
  return prisma.expense.aggregate({
    _sum: { amount: true },
    _count: true,
  });
}

export function getCategoryStats() {
  return prisma.expense.groupBy({
    by: ['category'],
    _sum: { amount: true },
    _count: { amount: true },
  });
}