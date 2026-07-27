import { z } from "zod";
import { CustomerStatus } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/

export const createCustomerSchema = z.object({

  name: z.string().min(2).max(200),

  companyName: z.string().optional(),

  email: z.string().email().optional(),

  phone: z.string().min(7).max(20).optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  country: z.string().optional(),

  status: z
    .nativeEnum(CustomerStatus)
    .optional(),

  notes: z.string().optional(),

});

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

export const updateCustomerSchema =
  createCustomerSchema.partial();

/*
|--------------------------------------------------------------------------
| Query Customers
|--------------------------------------------------------------------------
*/

export const queryCustomerSchema = z.object({

  search: z.string().optional(),

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