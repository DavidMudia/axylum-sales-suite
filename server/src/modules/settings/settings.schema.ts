import { z } from "zod";

export const updateSettingsSchema = z.object({
  // Business
  companyName: z.string().min(2).optional(),
  industry: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),

  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),

  // Finance
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),

  tax: z.number().optional(),

  quotePrefix: z.string().optional(),
  invoicePrefix: z.string().optional(),
  paymentPrefix: z.string().optional(),
  expensePrefix: z.string().optional(),

  quoteValidity: z.number().optional(),
  invoiceDueDays: z.number().optional(),

  decimalPlaces: z.number().optional(),

  // Appearance
  theme: z
    .enum(["LIGHT", "DARK", "SYSTEM"])
    .optional(),

  primaryColor: z.string().optional(),

  compactMode: z.boolean().optional(),

  sidebarCollapsed: z.boolean().optional(),

  fontSize: z
    .enum(["SMALL", "MEDIUM", "LARGE"])
    .optional(),

  tableDensity: z
    .enum([
      "COMPACT",
      "COMFORTABLE",
      "SPACIOUS",
    ])
    .optional(),
});

export type UpdateSettingsInput =
  z.infer<typeof updateSettingsSchema>;