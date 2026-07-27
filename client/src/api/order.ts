// src/api/order.ts
import api from './axios';

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'READY_FOR_LOADING'
  | 'LOADED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    sellingPrice: number;
  };
  quantity: number;
  unitPrice: number;
  negotiatedPrice?: number;
  total: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customer: {
    id: number;
    name: string;
    companyName?: string;
  };
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  labourFee: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  expectedDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  approvedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  // ✅ Add this optional invoice relation
  invoice?: {
    id: number;
    invoiceNumber: string;
    status: string;
  };
}

export interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  pending: number;
  approved: number;
  processing: number;
  readyForLoading: number;
  loaded: number;
  dispatched: number;
  delivered: number;
  cancelled: number;
}

export const getOrders = async (search?: string, status?: string, page = 1, limit = 20): Promise<OrdersResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/orders?${params.toString()}`);
  return res.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (data: any): Promise<Order> => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const updateOrder = async (id: number, data: any): Promise<Order> => {
  const res = await api.patch(`/orders/${id}`, data);
  return res.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}`);
};

export const approveOrder = async (id: number): Promise<Order> => {
  const res = await api.patch(`/orders/${id}/approve`);
  return res.data;
};

export const cancelOrder = async (id: number, reason: string): Promise<Order> => {
  const res = await api.patch(`/orders/${id}/cancel`, { reason });
  return res.data;
};

export const getOrderStats = async (): Promise<OrderStats> => {
  const res = await api.get('/orders/stats');
  return res.data;
};
export interface OrderItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    sellingPrice: number;
  };
  quantity: number;
  unitPrice: number;
  negotiatedPrice?: number;
  discount?: number;  // ✅ added
  total: number;
}
export const convertQuoteToOrder = async (quoteId: number): Promise<Order> => {
  const res = await api.post(`/orders/convert-from-quote/${quoteId}`);
  return res.data;
};