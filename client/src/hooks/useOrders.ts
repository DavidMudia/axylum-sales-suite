// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/order';
import type { OrdersResponse, OrderStats } from '../api/order';

export const ORDERS_QUERY_KEY = 'orders';

export function useOrders(search?: string, status?: string, page = 1, limit = 20) {
  return useQuery<OrdersResponse>({
    queryKey: [ORDERS_QUERY_KEY, search, status, page, limit],
    queryFn: () => api.getOrders(search, status, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => api.getOrder(id),
    enabled: !!id,
  });
}

export function useOrderStats() {
  return useQuery<OrderStats>({
    queryKey: ['order-stats'],
    queryFn: api.getOrderStats,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}

export function useApproveOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.approveOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => api.cancelOrder(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}
export function useConvertQuoteToOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quoteId: number) => api.convertQuoteToOrder(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}