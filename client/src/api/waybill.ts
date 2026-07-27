// src/api/waybill.ts
import api from './axios';

export type WaybillStatus =
  | 'PENDING'
  | 'LOADING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export interface WaybillItem {
  id: number;
  productId: number;
  product: { id: number; name: string };
  quantity: number;
  weight?: number;
}

export interface Waybill {
  id: number;
  waybillNumber: string;
  invoiceId: number;
  invoice: { id: number; invoiceNumber: string };
  vehicleId: number;
  vehicle: { id: number; registrationNumber: string };
  driverId: number;
  driver: { id: number; name: string };
  warehouseId: number;
  warehouse: { id: number; name: string };
  destination: string;
  status: WaybillStatus;
  verificationCode: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
  items: WaybillItem[];
}

export interface WaybillsResponse {
  data: Waybill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WaybillStats {
  totalWaybills: number;
  pending: number;
  loading: number;
  inTransit: number;
  delivered: number;
  returned: number;
  cancelled: number;
}

export const getWaybills = async (search?: string, status?: string, page = 1, limit = 20): Promise<WaybillsResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/waybills?${params.toString()}`);
  return res.data;
};

export const getWaybill = async (id: number): Promise<Waybill> => {
  const res = await api.get(`/waybills/${id}`);
  return res.data;
};

export const createWaybill = async (data: any): Promise<Waybill> => {
  const res = await api.post('/waybills', data);
  return res.data;
};

export const updateWaybillStatus = async (id: number, status: WaybillStatus): Promise<Waybill> => {
  const res = await api.patch(`/waybills/${id}/status`, { status });
  return res.data;
};

export const getWaybillStats = async (): Promise<WaybillStats> => {
  const res = await api.get('/waybills/stats');
  return res.data;
};