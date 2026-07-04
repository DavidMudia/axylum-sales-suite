import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  description: z.string().optional(),
  category: z.string().optional(),
  unitPrice: z.number().positive(),
  quantity: z.number().min(0),
});

export type CreateProductInput =
  z.infer<typeof createProductSchema>;