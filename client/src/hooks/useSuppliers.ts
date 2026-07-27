import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/supplier';
import type { SuppliersResponse } from '../api/supplier';

export const SUPPLIERS_QUERY_KEY = 'suppliers';

export function useSuppliers(search?: string, page = 1, limit = 20) {
  return useQuery<SuppliersResponse>({
    queryKey: [SUPPLIERS_QUERY_KEY, search, page, limit],
    queryFn: () => api.getSuppliers(search, page, limit),
    placeholderData: keepPreviousData,   // ✅ correct for v5
  });
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, id],
    queryFn: () => api.getSupplier(id),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.updateSupplier(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
  });
}

export function useRestoreSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.restoreSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
  });
}
// src/hooks/useSuppliers.ts
export function useSupplierStats() {
  return useQuery({
    queryKey: ['supplier-stats'],
    queryFn: api.getSupplierStats,
  });
}
export function useSupplierStatsById(id: number) {
  return useQuery({
    queryKey: ['supplier-stats', id],
    queryFn: () => api.getSupplierStatsById(id),
    enabled: !!id,
  });
}