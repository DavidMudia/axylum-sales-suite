// src/hooks/useQuotes.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/quote';
import type { QuotesResponse, QuoteStats } from '../api/quote';

export const QUOTES_QUERY_KEY = 'quotes';

export function useQuotes(search?: string, status?: string, page = 1, limit = 20) {
  return useQuery<QuotesResponse>({
    queryKey: [QUOTES_QUERY_KEY, search, status, page, limit],
    queryFn: () => api.getQuotes(search, status, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useQuote(id: number) {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, id],
    queryFn: () => api.getQuote(id),
    enabled: !!id,
  });
}

export function useQuoteStats() {
  return useQuery<QuoteStats>({
    queryKey: ['quote-stats'],
    queryFn: api.getQuoteStats,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['quote-stats'] });
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateQuote(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['quote-stats'] });
    },
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['quote-stats'] });
    },
  });
}

export function useApproveQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.approveQuote,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['quote-stats'] });
    },
  });
}

export function useRejectQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note: string }) => api.rejectQuote(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['quote-stats'] });
    },
  });
}