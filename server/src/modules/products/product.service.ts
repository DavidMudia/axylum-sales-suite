// server/src/modules/products/product.service.ts
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import * as repository from "./product.repository";
import bcrypt from "bcrypt";

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function create(data: any) {
  // 1. Verify password
  if (!data.createdById) throw new AppError("User ID missing", 400);
  const user = await prisma.user.findUnique({
    where: { id: Number(data.createdById) },
    select: { password: true },
  });
  if (!user) throw new AppError("User not found", 404);
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid password", 401);

  // 2. Check duplicate name
  const existing = await repository.findByName(data.name);
  if (existing) throw new AppError("Product already exists.", 400);

  // 3. Prepare product data
  const productData: Prisma.ProductCreateInput = {
    name: data.name,
    description: data.description,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    currentStock: data.currentStock ?? 0,
    minimumStock: data.minimumStock ?? 0,
    reorderLevel: data.reorderLevel ?? 0,
    productNumber: `PRD-${Date.now()}`,
    unit: data.unit,
    createdBy: { connect: { id: Number(data.createdById) } },
  };

  return repository.create(productData);
}

/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/

export async function getAll(search?: string, page = 1, limit = 20) {
  const products = await repository.findAll(search, page, limit);
  const total = await repository.count(search);
  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/*
|--------------------------------------------------------------------------
| Get Product
|--------------------------------------------------------------------------
*/

export async function getOne(id: number) {
  const product = await repository.findById(id);
  if (!product) throw new AppError("Product not found.", 404);
  return product;
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function update(id: number, data: any) {
  // 1. Verify password
  if (!data.updatedById) throw new AppError("User ID missing", 400);
  const user = await prisma.user.findUnique({
    where: { id: Number(data.updatedById) },
    select: { password: true },
  });
  if (!user) throw new AppError("User not found", 404);
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid password", 401);

  // 2. Remove sensitive fields that should not go to Prisma
  delete data.password;
  delete data.updatedById;

  // 3. Update product
  return repository.update(id, data);
}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export async function remove(id: number) {
  await getOne(id);
  return repository.softDelete(id);
}

/*
|--------------------------------------------------------------------------
| Restore Product
|--------------------------------------------------------------------------
*/

export async function restore(id: number) {
  await getOne(id);
  return repository.restore(id);
}

/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/

export async function lowStock() {
  return repository.getLowStockProducts();
}