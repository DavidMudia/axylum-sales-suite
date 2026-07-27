import api from "../services/api";

export interface DashboardResponse {
  cards: {
    customers: number;
    suppliers: number;
    products: number;
    invoices: number;
    salesOrders: number;
    purchaseOrders: number;
    payments: number;
    refunds: number;
    waybills: number;

    revenue: number;
    paymentsReceived: number;
    inventoryValue: number;
  };

  alerts: {
    lowStock: number;
    pendingPurchaseOrders: number;
    pendingRefunds: number;
    pendingWaybills: number;
  };

  recentOrders: any[];

  recentInvoices: any[];

  recentPayments: any[];

  lowStockProducts: any[];

  revenueTrend: {
    month: string;
    revenue: number;
  }[];
  recentActivity: {
  id: number;
  action: string;
  module: string;
  recordNumber: string | null;
  createdAt: string;
}[];
}

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await api.get("/dashboard");

  return data;
}