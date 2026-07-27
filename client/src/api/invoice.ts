// src/api/invoice.ts
import api from './axios';

export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
export type InvoicePaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export interface InvoiceItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    sellingPrice: number;
  };
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customer: {
    id: number;
    name: string;
    companyName?: string;
  };
  status: InvoiceStatus;
  paymentStatus: InvoicePaymentStatus;
  subtotal: number;
  deliveryFee: number;
  labourFee: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  dueDate?: string;
  notes?: string;
  verificationCode: string;
  isApproved: boolean;
  isPrinted: boolean;
  printedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
  salesOrderId?: number;
  salesOrder?: {
    id: number;
    orderNumber: string;
  };
  payments?: Array<{
    id: number;
    paymentNumber: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  waybills?: Array<{
    id: number;
    waybillNumber: string;
    status: string;
  }>;
  refunds?: Array<{
    id: number;
    refundNumber: string;
    status: string;
  }>;
}

export interface InvoicesResponse {
  data: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvoiceStats {
  totalInvoices: number;
  unpaid: number;
  partial: number;
  paid: number;
  totalRevenue: number;
}

export const getInvoices = async (search?: string, status?: string, page = 1, limit = 20): Promise<InvoicesResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/invoices?${params.toString()}`);
  return res.data;
};

export const getInvoice = async (id: number): Promise<Invoice> => {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
};

export const createInvoice = async (data: any): Promise<Invoice> => {
  const res = await api.post('/invoices', data);
  return res.data;
};

export const updateInvoice = async (id: number, data: any): Promise<Invoice> => {
  const res = await api.patch(`/invoices/${id}`, data);
  return res.data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await api.delete(`/invoices/${id}`);
};

export const approveInvoice = async (id: number, note?: string): Promise<Invoice> => {
  const res = await api.patch(`/invoices/${id}/approve`, { note });
  return res.data;
};

export const markInvoicePrinted = async (id: number): Promise<Invoice> => {
  const res = await api.patch(`/invoices/${id}/print`);
  return res.data;
};

export const convertSalesOrderToInvoice = async (salesOrderId: number): Promise<Invoice> => {
  const res = await api.post(`/invoices/sales-order/${salesOrderId}`);
  return res.data;
};

export const getInvoiceStats = async (): Promise<InvoiceStats> => {
  const res = await api.get('/invoices/stats');
  return res.data;
};