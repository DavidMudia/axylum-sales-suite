// src/api/supplier.ts
import api from './axios'; // or your actual import path

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface Supplier {
  id: number;
  name: string;
  companyName: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  notes: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  _count?: {
    purchaseOrders: number;
    goodsReceipts: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SuppliersResponse {
  data: Supplier[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ----------------------------------------------------------------------
// API functions
// ----------------------------------------------------------------------

export const getSuppliers = async (
  search?: string,
  page = 1,
  limit = 20
): Promise<SuppliersResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/suppliers?${params.toString()}`);
  return res.data;
};

export const getSupplier = async (id: number): Promise<Supplier> => {
  const res = await api.get(`/suppliers/${id}`);
  return res.data;
};

export const createSupplier = async (data: any): Promise<Supplier> => {
  const res = await api.post('/suppliers', data);
  return res.data;
};

export const updateSupplier = async (id: number, data: any): Promise<Supplier> => {
  const res = await api.patch(`/suppliers/${id}`, data);
  return res.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};

export const restoreSupplier = async (id: number): Promise<Supplier> => {
  const res = await api.patch(`/suppliers/${id}/restore`);
  return res.data;
};

export const getSupplierStats = async (): Promise<any> => {
  const res = await api.get('/suppliers/stats');
  return res.data;
};
// src/api/supplier.ts
export const getSupplierStatsById = async (id: number): Promise<any> => {
  const res = await api.get(`/suppliers/${id}/stats`);
  return res.data;
};