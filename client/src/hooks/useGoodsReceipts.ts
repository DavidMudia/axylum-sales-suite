// src/hooks/useGoodsReceipts.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/goodsReceipt';
// import type { GoodsReceiptDashboardResponse, GoodsReceiptDetails } from '../api/goodsReceipt';

export const GOODS_RECEIPTS_QUERY_KEY = 'goods-receipts';

export function useGoodsReceipts(search?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [GOODS_RECEIPTS_QUERY_KEY, search, page, limit],
    queryFn: () => api.getGoodsReceipts(page, search),
    placeholderData: keepPreviousData,
  });
}

export function useGoodsReceipt(id: number) {
  return useQuery({
    queryKey: [GOODS_RECEIPTS_QUERY_KEY, id],
    queryFn: () => api.getGoodsReceipt(id),
    enabled: !!id,
  });
}

export function useGoodsReceiptStats() {
  return useQuery({
    queryKey: ['goods-receipt-stats'],
    queryFn: () => api.getStatistics(),
  });
}

export function useGoodsReceiptDashboard() {
  return useQuery({
    queryKey: ['goods-receipt-dashboard'],
    queryFn: () => api.getDashboard(),
  });
}

export function useCreateGoodsReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createGoodsReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOODS_RECEIPTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-stats'] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-dashboard'] });
    },
  });
}

export function useUpdateGoodsReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateGoodsReceipt(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [GOODS_RECEIPTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GOODS_RECEIPTS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-stats'] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-dashboard'] });
    },
  });
}

export function useVerifyGoodsReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.verifyGoodsReceipt,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [GOODS_RECEIPTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GOODS_RECEIPTS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-stats'] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-dashboard'] });
    },
  });
}

export function useDeleteGoodsReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGoodsReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOODS_RECEIPTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-stats'] });
      queryClient.invalidateQueries({ queryKey: ['goods-receipt-dashboard'] });
    },
  });
}