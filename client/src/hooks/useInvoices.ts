// src/hooks/useInvoices.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/invoice';
import type { InvoicesResponse, InvoiceStats } from '../api/invoice';

export const INVOICES_QUERY_KEY = 'invoices';

export function useInvoices(search?: string, status?: string, page = 1, limit = 20) {
  return useQuery<InvoicesResponse>({
    queryKey: [INVOICES_QUERY_KEY, search, status, page, limit],
    queryFn: () => api.getInvoices(search, status, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, id],
    queryFn: () => api.getInvoice(id),
    enabled: !!id,
  });
}

export function useInvoiceStats() {
  return useQuery<InvoiceStats>({
    queryKey: ['invoice-stats'],
    queryFn: api.getInvoiceStats,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}

export function useApproveInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => api.approveInvoice(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}

export function useMarkInvoicePrinted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.markInvoicePrinted,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}

export function useConvertSalesOrderToInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.convertSalesOrderToInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}