// src/pages/Dashboard.tsx
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Truck,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";
import { usePurchaseOrderStats } from "../hooks/usePurchaseOrders";
import { useRefundStats } from "../hooks/useRefunds";
import { useWaybillStats } from "../hooks/useWaybills";
import { useProducts } from "../hooks/useProducts";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import RevenueCard from "../components/dashboard/RevenueCard";
import AlertsCard from "../components/dashboard/AlertsCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentOrders from "../components/dashboard/RecentOrders";
import ActivityFeed from "../components/dashboard/ActivityFeed";

import type { Product } from "../api/product"; // ✅ added

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  // Fetch additional real-time stats for alerts
  const { data: poStats, isLoading: poLoading } = usePurchaseOrderStats();
  const { data: refundStats, isLoading: refundLoading } = useRefundStats();
  const { data: waybillStats, isLoading: waybillLoading } = useWaybillStats();
  const { data: productsData, isLoading: productsLoading } = useProducts(undefined, 1);

  if (isLoading || poLoading || refundLoading || waybillLoading || productsLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-6 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        Failed to load dashboard.
      </div>
    );
  }

  // Build alerts object with real data
  const alerts = {
    lowStock: data?.alerts?.lowStock ?? 0,
    pendingPurchaseOrders: poStats?.pendingApproval ?? 0,
    pendingRefunds: refundStats?.pending ?? 0,
    pendingWaybills: waybillStats?.pending ?? 0,
  };

  // Low stock products
  const lowStockProducts = (productsData?.data ?? [])
    .filter((p: Product) => p.currentStock <= p.reorderLevel) // ✅ typed
    .map((p: Product) => ({                                   // ✅ typed
      id: p.id,
      name: p.name,
      quantity: p.currentStock,
      minimumStock: p.reorderLevel,
    }));

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="Business overview" />

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={`₦${Number(data?.cards?.revenue ?? 0).toLocaleString()}`}
          icon={<DollarSign />}
        />
        <StatCard
          title="Customers"
          value={data?.cards?.customers ?? 0}
          icon={<Users />}
        />
        <StatCard
          title="Products"
          value={data?.cards?.products ?? 0}
          icon={<Package />}
        />
        <StatCard
          title="Sales Orders"
          value={data?.cards?.salesOrders ?? 0}
          icon={<ShoppingCart />}
        />
        <StatCard
          title="Inventory Value"
          value={`₦${Number(data?.cards?.inventoryValue ?? 0).toLocaleString()}`}
          icon={<Warehouse />}
        />
        <StatCard
          title="Payments Received"
          value={`₦${Number(data?.cards?.paymentsReceived ?? 0).toLocaleString()}`}
          icon={<CreditCard />}
        />
        <StatCard
          title="Waybills"
          value={data?.cards?.waybills ?? 0}
          icon={<Truck />}
        />
        <StatCard
          title="Low Stock"
          value={alerts.lowStock}
          icon={<AlertTriangle />}
        />
      </div>

      {/* CHART + ALERTS */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueCard data={data?.revenueTrend ?? []} />
        </div>
        <AlertsCard
          alerts={alerts}
          lowStockProducts={lowStockProducts}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders orders={data?.recentOrders ?? []} />
        </div>
        <ActivityFeed activities={data?.recentActivity ?? []} />
      </div>

      <div className="mt-6">
        <QuickActions />
      </div>
    </div>
  );
}