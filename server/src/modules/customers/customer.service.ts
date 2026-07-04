import prisma from "../../lib/prisma";
import { CreateCustomerInput } from "./customer.schema";

export async function create(
  data: CreateCustomerInput,
  userId: number
) {
  return prisma.customer.create({
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

export async function getCustomerById(id: number) {
  return prisma.customer.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });
}

export async function updateCustomer(
  id: number,
  data: Partial<CreateCustomerInput>
) {
  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function softDeleteCustomer(id: number) {
  return prisma.customer.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
}

export async function getCustomerStats() {
  const totalCustomers = await prisma.customer.count({
    where: {
      isDeleted: false,
    },
  });

  const activeCustomers = await prisma.customer.count({
    where: {
      status: "ACTIVE",
      isDeleted: false,
    },
  });

  const inactiveCustomers = await prisma.customer.count({
    where: {
      status: "INACTIVE",
      isDeleted: false,
    },
  });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newThisMonth = await prisma.customer.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
      isDeleted: false,
    },
  });

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    newThisMonth,
  };
}