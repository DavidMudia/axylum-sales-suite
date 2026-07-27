// src/hooks/usePurchaseOrders.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/purchase-order';
import type { PurchaseOrdersResponse, PurchaseOrderStats } from '../api/purchase-order';

export const PURCHASE_ORDERS_QUERY_KEY = 'purchase-orders';

export function usePurchaseOrders(search?: string, status?: string, page = 1, limit = 20) {
  return useQuery<PurchaseOrdersResponse>({
    queryKey: [PURCHASE_ORDERS_QUERY_KEY, search, status, page, limit],
    queryFn: () => api.getPurchaseOrders(search, status as any, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function usePurchaseOrder(id: number) {
  return useQuery({
    queryKey: [PURCHASE_ORDERS_QUERY_KEY, id],
    queryFn: () => api.getPurchaseOrder(id),
    enabled: !!id,
  });
}

export function usePurchaseOrderStats() {
  return useQuery<PurchaseOrderStats>({
    queryKey: ['purchase-order-stats'],
    queryFn: api.getPurchaseOrderStats,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updatePurchaseOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
    },
  });
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.approvePurchaseOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
    },
  });
}

export function useCancelPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => api.cancelPurchaseOrder(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] });
    },
  });
}
export function useApprovedPurchaseOrders() {
  return useQuery({
    queryKey: ['approved-purchase-orders'],
    queryFn: api.getApprovedPurchaseOrders,
  });
}