// src/api/purchaseOrder.ts
import api from './axios';
import type { Supplier } from './supplier';
import type { Warehouse } from '../types/warehouse';   // ✅ from types folder
import type { Product } from '../types/product';       // ✅ from types folder

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  discount: number;
  tax: number;
  total: number;
  remarks?: string;
}

export interface PurchaseOrder {
  id: number;
  purchaseOrderNumber: string;
  supplierId: number;
  supplier: Supplier;
  warehouseId: number;
  warehouse: Warehouse;
  status: PurchaseOrderStatus;
  supplierReference?: string;
  expectedDeliveryDate?: string;
  receivedAt?: string;
  deliveryAddress?: string;
  notes?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: PurchaseOrderItem[];
  goodsReceipts: { id: number; receiptNumber: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrdersResponse {
  data: PurchaseOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PurchaseOrderStats {
  totalOrders: number;
  draft: number;
  pendingApproval: number;
  approved: number;
  partiallyReceived: number;
  received: number;
  cancelled: number;
}

// ----------------------------------------------------------------------
// API functions
// ----------------------------------------------------------------------

export const getPurchaseOrders = async (
  search?: string,
  status?: PurchaseOrderStatus,
  page = 1,
  limit = 20
): Promise<PurchaseOrdersResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/purchase-orders?${params.toString()}`);
  return res.data;
};

export const getPurchaseOrder = async (id: number): Promise<PurchaseOrder> => {
  const res = await api.get(`/purchase-orders/${id}`);
  return res.data;
};

export const createPurchaseOrder = async (data: any): Promise<PurchaseOrder> => {
  const res = await api.post('/purchase-orders', data);
  return res.data;
};

export const updatePurchaseOrder = async (id: number, data: any): Promise<PurchaseOrder> => {
  const res = await api.patch(`/purchase-orders/${id}`, data);
  return res.data;
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  await api.delete(`/purchase-orders/${id}`);
};

export const approvePurchaseOrder = async (id: number): Promise<PurchaseOrder> => {
  const res = await api.patch(`/purchase-orders/${id}/approve`);
  return res.data;
};

export const cancelPurchaseOrder = async (id: number, reason: string): Promise<PurchaseOrder> => {
  const res = await api.patch(`/purchase-orders/${id}/cancel`, { reason });
  return res.data;
};

export const getPurchaseOrderStats = async (): Promise<PurchaseOrderStats> => {
  const res = await api.get('/purchase-orders/stats');
  return res.data;
};
// src/api/purchaseOrder.ts – add this
export const getApprovedPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await api.get('/purchase-orders?status=APPROVED&limit=100');
  return res.data.data;
};