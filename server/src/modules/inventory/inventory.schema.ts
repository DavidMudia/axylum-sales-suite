import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Adjust Stock
|--------------------------------------------------------------------------
*/

export const adjustInventorySchema = z.object({
  quantity: z.number(),

  reason: z
    .string()
    .min(3)
    .max(255),

  notes: z
    .string()
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Inventory Query
|--------------------------------------------------------------------------
*/

export const inventoryQuerySchema =
  z.object({
    search: z.string().optional(),

    lowStock: z.coerce
      .boolean()
      .optional(),

    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(20),
  });

export type AdjustInventoryInput =
  z.infer<
    typeof adjustInventorySchema
  >;