import { z } from "zod";
import { SupplierStatus } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/

export const createSupplierSchema = z.object({
  name: z.string().min(2).max(200),

  companyName: z.string().optional(),

  contactPerson: z.string().optional(),

  email: z
    .string()
    .email()
    .optional()
    .or(z.literal("")),

  phone: z.string().min(5),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  country: z.string().optional(),

  notes: z.string().optional(),

  status: z
    .nativeEnum(SupplierStatus)
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

export const updateSupplierSchema =
  createSupplierSchema.partial();

/*
|--------------------------------------------------------------------------
| Query Supplier
|--------------------------------------------------------------------------
*/

export const querySupplierSchema = z.object({
  search: z.string().optional(),

  status: z
    .nativeEnum(SupplierStatus)
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

export type CreateSupplierInput =
  z.infer<typeof createSupplierSchema>;

export type UpdateSupplierInput =
  z.infer<typeof updateSupplierSchema>;