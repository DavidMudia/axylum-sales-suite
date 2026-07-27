// src/api/refund.ts
import api from './axios';

export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RefundMethod = 'CASH' | 'TRANSFER' | 'CARD' | 'CHEQUE' | 'OTHER';

export interface Refund {
  id: number;
  refundNumber: string;
  paymentId: number;
  payment: {
    id: number;
    paymentNumber: string;
    amount: number;
  };
  invoiceId: number;
  invoice: {
    id: number;
    invoiceNumber: string;
    total: number;
  };
  customerId: number;
  customer: {
    id: number;
    name: string;
  };
  amount: number;
  refundMethod: RefundMethod;
  reason: string;
  notes?: string;
  status: RefundStatus;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundsResponse {
  data: Refund[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RefundStats {
  totalRefunds: number;
  pending: number;
  approved: number;
  totalAmount: number;
}

export const getRefunds = async (search?: string, status?: string, page = 1, limit = 20): Promise<RefundsResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/refunds?${params.toString()}`);
  return res.data;
};

export const getRefund = async (id: number): Promise<Refund> => {
  const res = await api.get(`/refunds/${id}`);
  return res.data;
};

export const createRefund = async (data: any): Promise<Refund> => {
  const res = await api.post('/refunds', data);
  return res.data;
};

export const approveRefund = async (id: number, approvalNote?: string): Promise<Refund> => {
  const res = await api.patch(`/refunds/${id}/approve`, { approvalNote });
  return res.data;
};

export const rejectRefund = async (id: number, reason: string): Promise<Refund> => {
  const res = await api.patch(`/refunds/${id}/reject`, { rejectionReason: reason });
  return res.data;
};

export const getRefundStats = async (): Promise<RefundStats> => {
  const res = await api.get('/refunds/stats');
  return res.data;
};