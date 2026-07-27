import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Invoice Item
|--------------------------------------------------------------------------
*/

export const invoiceItemSchema = z.object({
  productId: z
    .number()
    .int()
    .positive(),

  quantity: z
    .number()
    .int()
    .positive(),

  unitPrice: z
    .number()
    .positive(),
});

/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
*/

export const createInvoiceSchema = z.object({
  customerId: z
    .number()
    .int()
    .positive(),

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

  dueDate: z
    .coerce
    .date()
    .optional(),

  notes: z
    .string()
    .max(1000)
    .optional(),

  discount: z
    .number()
    .min(0)
    .optional()
    .default(0),

  tax: z
    .number()
    .min(0)
    .optional()
    .default(0),

  items: z
    .array(invoiceItemSchema)
    .min(1),
});

/*
|--------------------------------------------------------------------------
| Update Invoice
|--------------------------------------------------------------------------
*/

export const updateInvoiceSchema = z.object({
  dueDate: z
    .coerce
    .date()
    .optional(),

    deliveryFee: z
  .number()
  .min(0)
  .optional(),

labourFee: z
  .number()
  .min(0)
  .optional(),

  notes: z
    .string()
    .max(1000)
    .optional(),

  discount: z
    .number()
    .min(0)
    .optional(),

  tax: z
    .number()
    .min(0)
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type CreateInvoiceInput =
  z.infer<typeof createInvoiceSchema>;

export type UpdateInvoiceInput =
  z.infer<typeof updateInvoiceSchema>;