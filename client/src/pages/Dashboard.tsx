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

import type { Product } from "../api/product";

export default function Dashboard() {
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  // --------------------------------------------------------------------------
  // Additional dashboard statistics
  // --------------------------------------------------------------------------

  const {
    data: poStats,
    isLoading: poLoading,
  } = usePurchaseOrderStats();

  const {
    data: refundStats,
    isLoading: refundLoading,
  } = useRefundStats();

  const {
    data: waybillStats,
    isLoading: waybillLoading,
  } = useWaybillStats();

  const {
    data: productsData,
    isLoading: productsLoading,
  } = useProducts(undefined, 1);

  // --------------------------------------------------------------------------
  // Loading
  // --------------------------------------------------------------------------

  if (
    isLoading ||
    poLoading ||
    refundLoading ||
    waybillLoading ||
    productsLoading
  ) {
    return <DashboardSkeleton />;
  }

  // --------------------------------------------------------------------------
  // Error
  // --------------------------------------------------------------------------

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h2 className="font-semibold">
          Failed to load dashboard
        </h2>

        <p className="mt-1 text-sm text-red-600">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Alerts
  // --------------------------------------------------------------------------

  const alerts = {
    lowStock: data?.alerts?.lowStock ?? 0,
    pendingPurchaseOrders:
      poStats?.pendingApproval ?? 0,
    pendingRefunds:
      refundStats?.pending ?? 0,
    pendingWaybills:
      waybillStats?.pending ?? 0,
  };

  // --------------------------------------------------------------------------
  // Low-stock products
  // --------------------------------------------------------------------------

  const lowStockProducts = (
    productsData?.data ?? []
  )
    .filter(
      (product: Product) =>
        product.currentStock <= product.reorderLevel
    )
    .map((product: Product) => ({
      id: product.id,
      name: product.name,
      quantity: product.currentStock,
      minimumStock: product.reorderLevel,
    }));

  // --------------------------------------------------------------------------
  // Dashboard
  // --------------------------------------------------------------------------

  return (
    <main className="min-w-0 space-y-6 sm:space-y-8">

      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}

      <PageHeader
        title="Dashboard"
        subtitle="Business overview"
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI Cards */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label="Business statistics"
        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4"
      >

        <StatCard
          title="Revenue"
          value={`₦${Number(
            data?.cards?.revenue ?? 0
          ).toLocaleString()}`}
          icon={<DollarSign size={20} />}
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
          value={`₦${Number(
            data?.cards?.inventoryValue ?? 0
          ).toLocaleString()}`}
          icon={<Warehouse />}
        />

        <StatCard
          title="Payments Received"
          value={`₦${Number(
            data?.cards?.paymentsReceived ?? 0
          ).toLocaleString()}`}
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

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Revenue + Alerts */}
      {/* ------------------------------------------------------------------ */}

      <section className="grid min-w-0 gap-6 xl:grid-cols-3">

        <div className="min-w-0 xl:col-span-2">
          <RevenueCard
            data={data?.revenueTrend ?? []}
          />
        </div>

        <div className="min-w-0">
          <AlertsCard
            alerts={alerts}
            lowStockProducts={lowStockProducts}
          />
        </div>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Recent Orders + Activity */}
      {/* ------------------------------------------------------------------ */}

      <section className="grid min-w-0 gap-6 xl:grid-cols-3">

        <div className="min-w-0 xl:col-span-2">
          <RecentOrders
            orders={data?.recentOrders ?? []}
          />
        </div>

        <div className="min-w-0">
          <ActivityFeed
            activities={data?.recentActivity ?? []}
          />
        </div>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Actions */}
      {/* ------------------------------------------------------------------ */}

      <section className="min-w-0">
        <QuickActions />
      </section>

    </main>
  );
}