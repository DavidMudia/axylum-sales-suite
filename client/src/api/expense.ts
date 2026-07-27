import api from './axios';

export type ExpenseCategory = 'TRANSPORTATION' | 'FUEL' | 'STAFF' | 'REPAIRS' | 'MARKETING' | 'UTILITIES' | 'OTHER';

export interface Expense {
  id: number;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesResponse {
  data: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ExpenseStats {
  totalAmount: number;
  totalCount: number;
  categoryStats: {
    category: ExpenseCategory;
    _sum: { amount: number };
    _count: { amount: number };
  }[];
}

export const getExpenses = async (
  search?: string,
  category?: string,
  startDate?: string,
  endDate?: string,
  page = 1,
  limit = 20
): Promise<ExpensesResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/expenses?${params.toString()}`);
  return res.data;
};

export const getExpense = async (id: number): Promise<Expense> => {
  const res = await api.get(`/expenses/${id}`);
  return res.data;
};

export const createExpense = async (data: any): Promise<Expense> => {
  const res = await api.post('/expenses', data);
  return res.data;
};

export const updateExpense = async (id: number, data: any): Promise<Expense> => {
  const res = await api.patch(`/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export const getExpenseStats = async (): Promise<ExpenseStats> => {
  const res = await api.get('/expenses/stats');
  return res.data;
};