// src/hooks/useRefunds.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/refund';
import type { RefundsResponse, RefundStats } from '../api/refund';

export const REFUNDS_QUERY_KEY = 'refunds';

export function useRefunds(search?: string, status?: string, page = 1, limit = 20) {
  return useQuery<RefundsResponse>({
    queryKey: [REFUNDS_QUERY_KEY, search, status, page, limit],
    queryFn: () => api.getRefunds(search, status, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useRefund(id: number) {
  return useQuery({
    queryKey: [REFUNDS_QUERY_KEY, id],
    queryFn: () => api.getRefund(id),
    enabled: !!id,
  });
}

export function useRefundStats() {
  return useQuery<RefundStats>({
    queryKey: ['refund-stats'],
    queryFn: api.getRefundStats,
  });
}

export function useCreateRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REFUNDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useApproveRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => api.approveRefund(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [REFUNDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REFUNDS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useRejectRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => api.rejectRefund(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [REFUNDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REFUNDS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
    },
  });
}