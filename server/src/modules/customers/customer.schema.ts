import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2),
  companyName: z.string().optional(),

  email: z.email().optional(),
  phone: z.string().min(7),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),

  notes: z.string().optional(),
});

export type CreateCustomerInput = z.infer<
  typeof createCustomerSchema
>;