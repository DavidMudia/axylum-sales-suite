import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/expense';
import type { ExpensesResponse, ExpenseStats } from '../api/expense';

export const EXPENSES_QUERY_KEY = 'expenses';

export function useExpenses(search?: string, category?: string, startDate?: string, endDate?: string, page = 1, limit = 20) {
  return useQuery<ExpensesResponse>({
    queryKey: [EXPENSES_QUERY_KEY, { search, category, startDate, endDate, page, limit }],
    queryFn: () => api.getExpenses(search, category, startDate, endDate, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useExpense(id: number) {
  return useQuery({
    queryKey: [EXPENSES_QUERY_KEY, id],
    queryFn: () => api.getExpense(id),
    enabled: !!id,
  });
}

export function useExpenseStats() {
  return useQuery<ExpenseStats>({
    queryKey: ['expense-stats'],
    queryFn: api.getExpenseStats,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
    },
  });
}