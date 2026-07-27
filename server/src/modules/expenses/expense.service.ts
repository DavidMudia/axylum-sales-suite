import { AppError } from "../../utils/AppError";
import * as repository from "./expense.repository";
import { CreateExpenseInput, UpdateExpenseInput } from "./expense.schema";

export async function create(data: CreateExpenseInput) {
  return repository.create({
    description: data.description,
    category: data.category,
    amount: data.amount,
    date: data.date,
    reference: data.reference,
  });
}

export async function getAll(
  search?: string,
  category?: string,
  startDate?: Date,
  endDate?: Date,
  page = 1,
  limit = 20
) {
  const expenses = await repository.findAll(search, category, startDate, endDate, page, limit);
  const total = await repository.count(search, category, startDate, endDate);
  return {
    data: expenses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOne(id: number) {
  const expense = await repository.findById(id);
  if (!expense) throw new AppError("Expense not found.", 404);
  return expense;
}

export async function update(id: number, data: UpdateExpenseInput) {
  await getOne(id);
  return repository.update(id, data);
}

export async function remove(id: number) {
  await getOne(id);
  return repository.remove(id);
}

export async function getStats() {
  const total = await repository.getStats();
  const categoryStats = await repository.getCategoryStats();
  return {
    totalAmount: total._sum.amount || 0,
    totalCount: total._count,
    categoryStats,
  };
}