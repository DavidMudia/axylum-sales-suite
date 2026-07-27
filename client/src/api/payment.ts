// src/api/payment.ts

import api from './axios';

export type PaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'CASH'
  | 'TRANSFER'
  | 'CHEQUE'
  | 'CARD'
  | 'OTHER';

export type InvoicePaymentStatus =
  | 'UNPAID'
  | 'PARTIAL'
  | 'PAID';

export interface Payment {
  id: number;

  paymentNumber: string;

  invoiceId: number;
  invoice: {
    id: number;
    invoiceNumber: string;

    total: number;
    amountPaid: number;
    balance: number;
    paymentStatus: InvoicePaymentStatus;
  };

  customerId: number;
  customer: {
    id: number;
    name: string;
  };

  amount: number;

  // Remaining refund calculation uses this
  refundedAmount: number;

  paymentMethod: PaymentMethod;

  transactionId?: string;

  status: PaymentStatus;

  notes?: string;

  approvedAt?: string;

  cancelledAt?: string;

  createdAt: string;

  updatedAt: string;
}

export interface PaymentsResponse {
  data: Payment[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  cancelledPayments: number;
  totalRevenue: number;
}

export const getPayments = async (
  search?: string,
  status?: string,
  refundable = false,
  page = 1,
  limit = 20
): Promise<PaymentsResponse> => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (refundable) params.append("refundable", "true");

  params.append("page", String(page));
  params.append("limit", String(limit));

  const res = await api.get(`/payments?${params.toString()}`);
  return res.data;
};
export const getPayment = async (
  id: number
): Promise<Payment> => {
  const res = await api.get(`/payments/${id}`);

  return res.data;
};

export const createPayment = async (
  data: any
): Promise<Payment> => {
  const res = await api.post('/payments', data);

  return res.data;
};

export const updatePayment = async (
  id: number,
  data: any
): Promise<Payment> => {
  const res = await api.patch(`/payments/${id}`, data);

  return res.data;
};

export const deletePayment = async (
  id: number
): Promise<void> => {
  await api.delete(`/payments/${id}`);
};

export const approvePayment = async (
  id: number
): Promise<Payment> => {
  const res = await api.patch(
    `/payments/${id}/approve`,
    {}
  );

  return res.data;
};

export const cancelPayment = async (
  id: number,
  reason: string
): Promise<Payment> => {
  const res = await api.patch(
    `/payments/${id}/cancel`,
    {
      reason,
    }
  );

  return res.data;
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
  const res = await api.get('/payments/stats');

  return res.data;
};