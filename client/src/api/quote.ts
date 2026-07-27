// src/api/quote.ts
import api from './axios';

// ============================================================
// Types
// ============================================================

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface QuoteItem {
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
  discount: number;
  total: number;
  remarks?: string;
}

export interface Quote {
  id: number;
  quoteNumber: string;
  customerId: number;
  customer: {
    id: number;
    name: string;
    companyName?: string;
  };
  status: QuoteStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  validUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: QuoteItem[];
  approvedAt?: string;
  rejectedAt?: string;
  approvalNote?: string;
}

export interface QuotesResponse {
  data: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QuoteStats {
  totalQuotes: number;
  draftQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  totalValue: number;
}

// ============================================================
// API Functions
// ============================================================

export const getQuotes = async (search?: string, status?: string, page = 1, limit = 20): Promise<QuotesResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/quotes?${params.toString()}`);
  return res.data;
};

export const getQuote = async (id: number): Promise<Quote> => {
  const res = await api.get(`/quotes/${id}`);
  return res.data;
};

export const createQuote = async (data: any): Promise<Quote> => {
  const res = await api.post('/quotes', data);
  return res.data;
};

export const updateQuote = async (id: number, data: any): Promise<Quote> => {
  const res = await api.patch(`/quotes/${id}`, data);
  return res.data;
};

export const deleteQuote = async (id: number): Promise<void> => {
  await api.delete(`/quotes/${id}`);
};

export const approveQuote = async (id: number): Promise<Quote> => {
  const res = await api.patch(`/quotes/${id}/approve`);
  return res.data;
};

export const rejectQuote = async (id: number, note: string): Promise<Quote> => {
  const res = await api.patch(`/quotes/${id}/reject`, { note });
  return res.data;
};

export const getQuoteStats = async (): Promise<QuoteStats> => {
  const res = await api.get('/quotes/stats');
  return res.data;
};