// server/src/modules/products/product.schema.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  unit: z.string(),
  costPrice: z.coerce.number(),
  sellingPrice: z.coerce.number(),
  currentStock: z.coerce.number().default(0),
  minimumStock: z.coerce.number().default(0),
  reorderLevel: z.coerce.number().default(0).optional(),
  // ✅ REMOVE hasExpiryDate – not in the Prisma model
  password: z.string().min(1, "Password is required"),
});

export const updateProductSchema = createProductSchema.partial();

export const queryProductSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});