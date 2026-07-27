import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Date Range
|--------------------------------------------------------------------------
*/

export const reportQuerySchema = z.object({
  startDate: z.string().datetime().optional(),

  endDate: z.string().datetime().optional(),

  customerId: z.coerce.number().int().positive().optional(),

  supplierId: z.coerce.number().int().positive().optional(),

  warehouseId: z.coerce.number().int().positive().optional(),

  salespersonId: z.coerce.number().int().positive().optional(),
});

export type ReportQueryInput =
  z.infer<typeof reportQuerySchema>;