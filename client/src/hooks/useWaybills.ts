// src/hooks/useWaybills.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/waybill';
import type { WaybillsResponse, WaybillStats } from '../api/waybill';

export const WAYBILLS_QUERY_KEY = 'waybills';

export function useWaybills(search?: string, status?: string, page = 1, limit = 20) {
  return useQuery<WaybillsResponse>({
    queryKey: [WAYBILLS_QUERY_KEY, search, status, page, limit],
    queryFn: () => api.getWaybills(search, status, page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useWaybill(id: number) {
  return useQuery({
    queryKey: [WAYBILLS_QUERY_KEY, id],
    queryFn: () => api.getWaybill(id),
    enabled: !!id,
  });
}

export function useWaybillStats() {
  return useQuery<WaybillStats>({
    queryKey: ['waybill-stats'],
    queryFn: api.getWaybillStats,
  });
}

export function useCreateWaybill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createWaybill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAYBILLS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['waybill-stats'] });
    },
  });
}

export function useUpdateWaybillStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: any }) => api.updateWaybillStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [WAYBILLS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WAYBILLS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['waybill-stats'] });
    },
  });
}