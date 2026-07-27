import { z } from "zod";

export const createQuoteItemSchema = z.object({
  productId: z.number().int().positive(),

  quantity: z.number().positive(),

  unitPrice: z.number().nonnegative(),

  negotiatedPrice: z.number().nonnegative().optional(),

  discount: z.number().min(0).default(0),

  remarks: z.string().max(300).optional(),
});

export const createQuoteSchema = z.object({
  customerId: z.number().int().positive(),

  validUntil: z.coerce.date().optional(),

  notes: z.string().max(1000).optional(),

  deliveryAddress: z.string().max(500).optional(),

  deliveryInstructions: z
    .string()
    .max(500)
    .optional(),

  items: z
    .array(createQuoteItemSchema)
    .min(1, "Quote must contain at least one item."),
});

export type CreateQuoteInput = z.infer<
  typeof createQuoteSchema
>;

export const updateQuoteSchema =
  createQuoteSchema.partial();

export type UpdateQuoteInput = z.infer<
  typeof updateQuoteSchema
>;