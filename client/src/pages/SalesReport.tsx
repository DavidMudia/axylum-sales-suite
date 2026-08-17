// src/pages/SalesReport.tsx

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '../hooks/useProducts';
import { useWarehouses } from '../hooks/useWarehouses';

import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

import { formatCurrency } from '../utils/currency';
import { statusColor } from '../utils/statusColor';

import {
  getSalesReport,
  exportSalesReport,
  saveReport,
  getSavedReports,
  loadSavedReport,
} from '../api/reports';

import type { Customer } from '../api/customer';
import type { Product } from '../api/product';
import type { Warehouse } from '../api/warehouse';

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#fb7185',
  '#f97316',
  '#eab308',
  '#22d3ee',
];

type Tab = 'overview' | 'products' | 'heatmap' | 'regional';

type ReportFilters = {
  startDate: string;
  endDate: string;
  customerId?: number;
  productId?: number;
  warehouseId?: number;
};

type SavedReport = {
  id: number;
  name: string;
  createdAt: string;
  filters?: ReportFilters;
};

type SalesReportData = {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalItems: number;
  };

  categoryData: {
    name: string;
    value: number;
  }[];

  orders: {
    id: number;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    customer: {
      name: string;
    };
  }[];

  regionalData: {
    name: string;
    revenue: number;
    orders: number;
    profit: number;
  }[];

  topProducts: {
    name: string;
    revenue: number;
  }[];

  bottomProducts: {
    name: string;
    revenue: number;
  }[];

  growingProducts: {
    name: string;
    growth: number;
  }[];

  decliningProducts: {
    name: string;
    growth: number;
  }[];

  dayHeatmap: {
    day: string;
    revenue: number;
  }[];

  monthHeatmap: {
    month: string;
    revenue: number;
  }[];
};

export default function SalesReport() {
  const queryClient = useQueryClient();

  const today = new Date();
  const firstDay = subMonths(today, 1);

  const [startDate, setStartDate] = useState(
    format(firstDay, 'yyyy-MM-dd')
  );

  const [endDate, setEndDate] = useState(
    format(today, 'yyyy-MM-dd')
  );

  const [customerId, setCustomerId] = useState<number | ''>('');
  const [productId, setProductId] = useState<number | ''>('');
  const [warehouseId, setWarehouseId] = useState<number | ''>('');

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [selectedSavedReportId, setSelectedSavedReportId] =
    useState<number | ''>('');

  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();

  const reportFilters: ReportFilters = {
    startDate,
    endDate,
    customerId: customerId || undefined,
    productId: productId || undefined,
    warehouseId: warehouseId || undefined,
  };

  const {
    data,
    isLoading,
    refetch,
  } = useQuery<SalesReportData>({
    queryKey: [
      'sales-report',
      {
        startDate,
        endDate,
        customerId,
        productId,
        warehouseId,
      },
    ],
    queryFn: () => getSalesReport(reportFilters),
    enabled: Boolean(startDate && endDate),
  });

  const {
    data: savedReports,
    refetch: refetchSaved,
  } = useQuery<SavedReport[]>({
    queryKey: ['saved-reports'],
    queryFn: getSavedReports,
  });

  const handleGenerate = () => {
    refetch();
  };

  const handleExport = () => {
    const url = exportSalesReport(reportFilters);
    window.open(url, '_blank');
  };

  const handleSave = async () => {
    const name = prompt('Enter a name for this report:');

    if (!name?.trim()) {
      return;
    }

    try {
      await saveReport(name.trim(), reportFilters);

      alert('Report saved successfully.');

      await refetchSaved();
    } catch {
      alert('Failed to save report.');
    }
  };

  const handleLoadSaved = async (reportId: number) => {
    try {
      await loadSavedReport(reportId);

      const savedReport = savedReports?.find(
        (report) => report.id === reportId
      );

      if (!savedReport?.filters) {
        return;
      }

      const filters = savedReport.filters;

      if (filters.startDate) {
        setStartDate(
          format(new Date(filters.startDate), 'yyyy-MM-dd')
        );
      }

      if (filters.endDate) {
        setEndDate(
          format(new Date(filters.endDate), 'yyyy-MM-dd')
        );
      }

      setCustomerId(filters.customerId ?? '');
      setProductId(filters.productId ?? '');
      setWarehouseId(filters.warehouseId ?? '');

      queryClient.invalidateQueries({
        queryKey: ['sales-report'],
      });
    } catch {
      alert('Failed to load report.');
    }
  };

  const resetFilters = () => {
    setStartDate(format(firstDay, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
    setCustomerId('');
    setProductId('');
    setWarehouseId('');
    setSelectedSavedReportId('');
  };

  if (isLoading) {
    return (
      <div className="space-y-8 text-slate-900">
        <PageHeader
          title="Sales Analytics"
          subtitle="Deep dive into sales performance."
        />

        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading sales report...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-900">

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader
          title="Sales Analytics"
          subtitle="Deep dive into sales performance and business trends."
        />
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Report Filters
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a date range and optional filters to generate your sales report.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />

          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />

          <FilterSelect
            label="Customer"
            value={customerId}
            onChange={(value) => setCustomerId(value)}
          >
            <option value="">All Customers</option>

            {customers?.data?.map((customer: Customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Product"
            value={productId}
            onChange={(value) => setProductId(value)}
          >
            <option value="">All Products</option>

            {products?.data?.map((product: Product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Branch / Warehouse"
            value={warehouseId}
            onChange={(value) => setWarehouseId(value)}
          >
            <option value="">All Branches</option>

            {warehouses?.data?.map((warehouse: Warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </FilterSelect>

        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-3">

            <Button onClick={handleGenerate}>
              Generate Report
            </Button>

            <Button
              variant="secondary"
              onClick={handleExport}
            >
              Export CSV
            </Button>

            <Button
              variant="secondary"
              onClick={handleSave}
            >
              Save Report
            </Button>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Reset
            </button>

          </div>

          <div className="flex w-full items-center gap-3 lg:w-auto">

            <label
              htmlFor="saved-report"
              className="whitespace-nowrap text-sm font-medium text-slate-700"
            >
              Load Saved:
            </label>

            <select
              id="saved-report"
              value={selectedSavedReportId}
              onChange={(event) => {
                const value = Number(event.target.value);

                setSelectedSavedReportId(value || '');

                if (value) {
                  handleLoadSaved(value);
                }
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 lg:w-64"
            >
              <option value="">
                Select a report
              </option>

              {savedReports?.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name} (
                  {new Date(report.createdAt).toLocaleDateString()}
                  )
                </option>
              ))}
            </select>

          </div>
        </div>
      </section>

      {/* Empty State */}
      {!data && (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No report data available
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Select your filters and generate a sales report.
          </p>
        </div>
      )}

      {/* Report */}
      {data && (
        <>
          {/* Tabs */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5">
            <nav
              className="flex gap-6 overflow-x-auto"
              aria-label="Sales report tabs"
            >
              {(
                [
                  'overview',
                  'products',
                  'heatmap',
                  'regional',
                ] as Tab[]
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium capitalize transition ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {tab === 'heatmap' ? 'Sales Trends' : tab}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && (
            <OverviewTab data={data} />
          )}

          {activeTab === 'products' && (
            <ProductsTab data={data} />
          )}

          {activeTab === 'heatmap' && (
            <HeatmapTab data={data} />
          )}

          {activeTab === 'regional' && (
            <RegionalTab data={data} />
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter Select */
/* -------------------------------------------------------------------------- */

type FilterSelectProps = {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  children: React.ReactNode;
};

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: FilterSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value) || '');
        }}
        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {children}
      </select>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview */
/* -------------------------------------------------------------------------- */

function OverviewTab({
  data,
}: {
  data: SalesReportData;
}) {
  const {
    summary,
    categoryData,
    orders,
    regionalData,
  } = data;

  return (
    <div className="space-y-8">

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
        />

        <StatCard
          label="Total Orders"
          value={summary.totalOrders.toLocaleString()}
        />

        <StatCard
          label="Average Order Value"
          value={formatCurrency(summary.avgOrderValue)}
        />

        <StatCard
          label="Total Items Sold"
          value={summary.totalItems.toLocaleString()}
        />

      </div>

      {/* Category + Branches */}
      <div className="grid gap-6 xl:grid-cols-2">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Sales by Category
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Revenue distribution across product categories.
            </p>
          </div>

          <div className="mt-6 h-72">

            {categoryData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {categoryData.map(
                      (_entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(Number(value))
                    }
                  />

                </PieChart>
              </ResponsiveContainer>
            )}

          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Top Branches
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Highest revenue-generating branches.
          </p>

          <div className="mt-6 space-y-3">

            {regionalData.length === 0 ? (
              <EmptyList />
            ) : (
              regionalData
                .slice(0, 5)
                .map((branch) => (
                  <div
                    key={branch.name}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                  >
                    <span className="font-medium text-slate-700">
                      {branch.name}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {formatCurrency(branch.revenue)}
                    </span>
                  </div>
                ))
            )}

          </div>
        </section>

      </div>

      {/* Recent Orders */}
      <RecentOrders orders={orders} />

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent Orders */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Recent Orders */
/* -------------------------------------------------------------------------- */

function RecentOrders({
  orders,
}: {
  orders: SalesReportData['orders'];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Section Header */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Orders
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Customer orders recorded within the selected reporting period.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {orders.length}{' '}
            {orders.length === 1 ? 'order' : 'orders'}
          </div>
        )}

      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="px-6 py-16 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Eye
              size={20}
              className="text-slate-400"
            />
          </div>

          <h4 className="mt-4 text-sm font-semibold text-slate-900">
            No orders found
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            There are no customer orders matching the selected filters.
          </p>

        </div>
      ) : (
        <>
          {/* ---------------------------------------------------------------- */}
          {/* Desktop Table */}
          {/* ---------------------------------------------------------------- */}

          <div className="hidden md:block">
            <table className="w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">
                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Order #
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">

                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Order */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        to={`/orders/${order.id}`}
                        className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                          {order.customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {order.customer.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            Customer
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Total */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(order.total)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    {/* Created */}
                    <td className="whitespace-nowrap px-6 py-4">

                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {new Date(
                            order.createdAt
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                    </td>

                    {/* Action */}
                    <td className="whitespace-nowrap px-6 py-4 text-right">

                      <Link
                        to={`/orders/${order.id}`}
                        title="View order"
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Eye size={17} />
                      </Link>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Mobile Cards */}
          {/* ---------------------------------------------------------------- */}

          <div className="divide-y divide-slate-100 md:hidden">

            {orders.map((order) => (

              <div
                key={order.id}
                className="p-5"
              >

                {/* Top Row */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                      {order.customer.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-semibold text-slate-900">
                        {order.customer.name}
                      </p>

                      <Link
                        to={`/orders/${order.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {order.orderNumber}
                      </Link>

                    </div>

                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    title="View order"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Eye size={17} />
                  </Link>

                </div>

                {/* Order Details */}
                <div className="mt-4 grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Status
                    </p>

                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <p className="text-xs text-slate-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>
        </>
      )}

    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Products */
/* -------------------------------------------------------------------------- */

function ProductsTab({
  data,
}: {
  data: SalesReportData;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">

      <ProductListCard
        title="Top 5 Products"
        subtitle="Highest revenue-generating products."
        products={data.topProducts}
      />

      <ProductListCard
        title="Bottom 5 Products"
        subtitle="Lowest revenue-generating products."
        products={data.bottomProducts}
      />

      <GrowthCard
        title="Fastest Growing"
        subtitle="Products showing the strongest growth."
        products={data.growingProducts}
        positive
      />

      <GrowthCard
        title="Declining Products"
        subtitle="Products experiencing declining sales."
        products={data.decliningProducts}
        positive={false}
      />

    </div>
  );
}

function ProductListCard({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle: string;
  products: {
    name: string;
    revenue: number;
  }[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>

      <div className="mt-6 space-y-3">

        {products.length === 0 ? (
          <EmptyList />
        ) : (
          products.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
            >
              <span className="font-medium text-slate-700">
                {product.name}
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(product.revenue)}
              </span>
            </div>
          ))
        )}

      </div>
    </section>
  );
}

function GrowthCard({
  title,
  subtitle,
  products,
  positive,
}: {
  title: string;
  subtitle: string;
  products: {
    name: string;
    growth: number;
  }[];
  positive: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>

      <div className="mt-6 space-y-3">

        {products.length === 0 ? (
          <p className="text-sm text-slate-500">
            Insufficient data.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
            >
              <span className="font-medium text-slate-700">
                {product.name}
              </span>

              <span
                className={
                  positive
                    ? 'font-semibold text-emerald-600'
                    : 'font-semibold text-red-600'
                }
              >
                {positive ? '+' : ''}
                {product.growth.toFixed(1)}%
              </span>
            </div>
          ))
        )}

      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Sales Trends */
/* -------------------------------------------------------------------------- */

function HeatmapTab({
  data,
}: {
  data: SalesReportData;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">

      <SalesChartCard
        title="Sales by Day of Week"
        description="Revenue performance across different days."
        data={data.dayHeatmap}
        xKey="day"
      />

      <SalesChartCard
        title="Sales by Month"
        description="Monthly revenue performance."
        data={data.monthHeatmap}
        xKey="month"
      />

    </div>
  );
}

function SalesChartCard({
  title,
  description,
  data,
  xKey,
}: {
  title: string;
  description: string;
  data: {
    [key: string]: string | number;
    revenue: number;
  }[];
  xKey: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-6 h-72">

        {data.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey={xKey} />

              <YAxis
                tickFormatter={(value) =>
                  formatCurrency(value)
                }
              />

              <Tooltip
                formatter={(value) =>
                  formatCurrency(Number(value))
                }
              />

              <Bar
                dataKey="revenue"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        )}

      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Regional */
/* -------------------------------------------------------------------------- */

function RegionalTab({
  data,
}: {
  data: SalesReportData;
}) {
  const { regionalData } = data;

  return (
    <div className="grid gap-6 xl:grid-cols-2">

      <RegionalCard
        title="Revenue by Branch"
        description="Revenue and order volume by branch."
      >
        {regionalData.length === 0 ? (
          <EmptyList />
        ) : (
          regionalData.map((branch) => (
            <div
              key={branch.name}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
            >
              <div>
                <p className="font-medium text-slate-700">
                  {branch.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {branch.orders.toLocaleString()} orders
                </p>
              </div>

              <span className="font-semibold text-slate-900">
                {formatCurrency(branch.revenue)}
              </span>
            </div>
          ))
        )}
      </RegionalCard>

      <RegionalCard
        title="Profit by Branch"
        description="Profitability across each branch."
      >
        {regionalData.length === 0 ? (
          <EmptyList />
        ) : (
          regionalData.map((branch) => (
            <div
              key={branch.name}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
            >
              <span className="font-medium text-slate-700">
                {branch.name}
              </span>

              <span
                className={`font-semibold ${
                  branch.profit >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(branch.profit)}
              </span>
            </div>
          ))
        )}
      </RegionalCard>

    </div>
  );
}

function RegionalCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-6 space-y-3">
        {children}
      </div>

    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared UI */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </h3>

    </div>
  );
}

function EmptyList() {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-slate-500">
        No data available.
      </p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-slate-500">
        No chart data available.
      </p>
    </div>
  );
}