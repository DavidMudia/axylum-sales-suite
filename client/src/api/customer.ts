// src/api/customer.ts
import api from './axios';

export interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  outstandingBalance: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations – only present when fetching a single customer
  quotes?: Array<{ id: number; quoteNumber: string; createdAt: string }>;
  salesOrders?: Array<{ id: number; orderNumber: string; createdAt: string }>;
  invoices?: Array<{ id: number; invoiceNumber: string; createdAt: string }>;
  payments?: Array<{ id: number; paymentNumber: string; createdAt: string }>;
  refunds?: Array<{ id: number; refundNumber: string; createdAt: string }>;
}

export interface CustomersResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  blockedCustomers: number;
  totalOutstanding: number;
}

export const getCustomers = async (search?: string, page = 1, limit = 20): Promise<CustomersResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/customers?${params.toString()}`);
  return res.data;
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

export const createCustomer = async (data: any): Promise<Customer> => {
  const res = await api.post('/customers', data);
  return res.data;
};

export const updateCustomer = async (id: number, data: any): Promise<Customer> => {
  const res = await api.patch(`/customers/${id}`, data);
  return res.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

export const restoreCustomer = async (id: number): Promise<Customer> => {
  const res = await api.patch(`/customers/${id}/restore`);
  return res.data;
};

export const getCustomerStats = async (): Promise<CustomerStats> => {
  const res = await api.get('/customers/stats');
  return res.data;
};