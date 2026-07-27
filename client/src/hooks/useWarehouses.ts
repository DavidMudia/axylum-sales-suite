// src/hooks/useWarehouses.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/warehouse';

export const WAREHOUSES_QUERY_KEY = 'warehouses';

export function useWarehouses(search?: string, page = 1, limit = 100) {
  return useQuery({
    queryKey: [WAREHOUSES_QUERY_KEY, search, page, limit],
    queryFn: () => api.getWarehouses(page, search),
    placeholderData: keepPreviousData,
  });
}