import { z } from "zod";

export const createSalesOrderSchema = z.object({
  quoteId: z.number().int().positive().optional(),

  customerId: z.number().int().positive(),

  deliveryAddress: z
    .string()
    .max(500)
    .optional(),

  deliveryInstructions: z
    .string()
    .max(1000)
    .optional(),

  expectedDeliveryDate: z
    .coerce
    .date()
    .optional(),

  notes: z
    .string()
    .max(1000)
    .optional(),

  deliveryFee: z
    .number()
    .min(0)
    .optional()
    .default(0),

  labourFee: z
    .number()
    .min(0)
    .optional()
    .default(0),

  tax: z
    .number()
    .min(0)
    .optional()
    .default(0),

  discount: z
    .number()
    .min(0)
    .optional()
    .default(0),

  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),

        quantity: z
          .number()
          .positive(),

        unitPrice: z
          .number()
          .nonnegative(),

        negotiatedPrice: z
          .number()
          .nonnegative()
          .optional(),

        discount: z
          .number()
          .nonnegative()
          .default(0),
      })
    )
    .min(1),
});

export const updateSalesOrderSchema =
  createSalesOrderSchema.partial();

export type CreateSalesOrderInput =
  z.infer<typeof createSalesOrderSchema>;

export type UpdateSalesOrderInput =
  z.infer<typeof updateSalesOrderSchema>;