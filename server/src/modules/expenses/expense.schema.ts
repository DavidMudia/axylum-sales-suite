import { z } from 'zod';

export const createExpenseSchema = z.object({
  description: z.string().min(1).max(500),
  category: z.enum(['TRANSPORTATION', 'FUEL', 'STAFF', 'REPAIRS', 'MARKETING', 'UTILITIES', 'OTHER']),
  amount: z.number().positive(),
  date: z.coerce.date(),
  reference: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;