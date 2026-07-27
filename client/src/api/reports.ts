// src/api/reports.ts
import api from './axios';

export interface SalesReportFilters {
  startDate?: string;
  endDate?: string;
  customerId?: number;
  productId?: number;
  warehouseId?: number;
}

export interface SalesReportResponse {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalItems: number;
  };
  categoryData: { name: string; value: number }[];
  topProducts: any[];
  bottomProducts: any[];
  growingProducts: any[];
  decliningProducts: any[];
  dayHeatmap: any[];
  monthHeatmap: any[];
  regionalData: any[];
  orders: any[];
}

export const getSalesReport = async (filters: SalesReportFilters): Promise<SalesReportResponse> => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.customerId) params.append('customerId', String(filters.customerId));
  if (filters.productId) params.append('productId', String(filters.productId));
  if (filters.warehouseId) params.append('warehouseId', String(filters.warehouseId));
  const res = await api.get(`/reports/sales?${params.toString()}`);
  return res.data;
};

export const exportSalesReport = (filters: SalesReportFilters): string => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.customerId) params.append('customerId', String(filters.customerId));
  if (filters.productId) params.append('productId', String(filters.productId));
  if (filters.warehouseId) params.append('warehouseId', String(filters.warehouseId));
  return `/api/reports/sales/export?${params.toString()}`;
};

export const saveReport = async (name: string, filters: SalesReportFilters): Promise<any> => {
  const res = await api.post('/reports/sales/save', { name, filters });
  return res.data;
};

export const getSavedReports = async (): Promise<any[]> => {
  const res = await api.get('/reports/sales/saved');
  return res.data;
};

export const loadSavedReport = async (id: number): Promise<SalesReportResponse> => {
  const res = await api.get(`/reports/sales/saved/${id}`);
  return res.data;
};
// src/api/reports.ts (add to existing file)

export interface InventoryReportFilters {
  startDate?: string;
  endDate?: string;
  warehouseId?: number;
}

export interface InventoryReportResponse {
  summary: {
    totalInventoryValue: number;
    totalAvailableStock: number;
    outOfStockCount: number;
    lowStockCount: number;
    slowMoving: number;
    fastMoving: number;
    turnover: number;
    shrinkage: number;
  };
  movement: { month: string; inbound: number; outbound: number }[];
  warehouseCapacity: { name: string; stock: number }[];
  forecast: {
    productId: number;
    name: string;
    stock: number;
    avgDailySales: number;
    daysRemaining: number | null;
    predictedStockOut: string | null;
  }[];
  supplierPerformance: {
    name: string;
    onTimeDeliveryRate: number;
    rejectedQty: number;
    totalPOs: number;
  }[];
  productStockData: {
    productId: number;
    name: string;
    stock: number;
    available: number;
    minimumStock: number;
    costPrice: number;
    value: number;
  }[];
}

export const getInventoryReport = async (filters: InventoryReportFilters): Promise<InventoryReportResponse> => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.warehouseId) params.append('warehouseId', String(filters.warehouseId));
  const res = await api.get(`/reports/inventory?${params.toString()}`);
  return res.data;
};
export interface FinancialReportFilters {
  startDate?: string;
  endDate?: string;
  branchId?: number;
}

export const getFinancialReport = async (filters: FinancialReportFilters) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.branchId) params.append('branchId', String(filters.branchId));
  const res = await api.get(`/reports/financial?${params.toString()}`);
  return res.data;
};