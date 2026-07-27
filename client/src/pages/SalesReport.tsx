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
import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '../hooks/useProducts';
import { useWarehouses } from '../hooks/useWarehouses';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/currency';
import { statusColor } from '../utils/statusColor';
import { getSalesReport, exportSalesReport, saveReport, getSavedReports, loadSavedReport } from '../api/reports';
import { Link } from 'react-router-dom';
import type { Customer } from '../api/customer'; // ✅ added
import type { Product } from '../api/product'; // ✅ added
import type { Warehouse } from '../api/warehouse'; // ✅ added

const COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#fb7185', '#f97316', '#eab308', '#22d3ee'
];

type Tab = 'overview' | 'products' | 'heatmap' | 'regional';

export default function SalesReport() {
  const queryClient = useQueryClient();
  const today = new Date();
  const firstDay = subMonths(today, 1);
  const [startDate, setStartDate] = useState(format(firstDay, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'));
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [productId, setProductId] = useState<number | ''>('');
  const [warehouseId, setWarehouseId] = useState<number | ''>('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedSavedReportId, setSelectedSavedReportId] = useState<number | ''>('');

  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();

  // Main report query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sales-report', { startDate, endDate, customerId, productId, warehouseId }],
    queryFn: () =>
      getSalesReport({
        startDate,
        endDate,
        customerId: customerId || undefined,
        productId: productId || undefined,
        warehouseId: warehouseId || undefined,
      }),
    enabled: !!startDate && !!endDate,
  });

  // Saved reports list
  const { data: savedReports, refetch: refetchSaved } = useQuery({
    queryKey: ['saved-reports'],
    queryFn: getSavedReports,
  });

  const handleGenerate = () => refetch();

  // Export CSV
  const handleExport = () => {
    const url = exportSalesReport({
      startDate,
      endDate,
      customerId: customerId || undefined,
      productId: productId || undefined,
      warehouseId: warehouseId || undefined,
    });
    window.open(url, '_blank');
  };

  // Save report
  const handleSave = async () => {
    const name = prompt('Enter a name for this report:');
    if (!name) return;
    try {
      await saveReport(name, {
        startDate,
        endDate,
        customerId: customerId || undefined,
        productId: productId || undefined,
        warehouseId: warehouseId || undefined,
      });
      alert('Report saved successfully.');
      refetchSaved();
    } catch (error) {
      alert('Failed to save report.');
    }
  };

  // Load saved report
  const handleLoadSaved = async (reportId: number) => {
    try {
      await loadSavedReport(reportId);
      const savedReport = savedReports?.find((r: any) => r.id === reportId);
      if (savedReport?.filters) {
        const f = savedReport.filters;
        if (f.startDate) setStartDate(format(new Date(f.startDate), 'yyyy-MM-dd'));
        if (f.endDate) setEndDate(format(new Date(f.endDate), 'yyyy-MM-dd'));
        if (f.customerId) setCustomerId(f.customerId);
        if (f.productId) setProductId(f.productId);
        if (f.warehouseId) setWarehouseId(f.warehouseId);
        queryClient.invalidateQueries({ queryKey: ['sales-report'] });
      }
    } catch (error) {
      alert('Failed to load report.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-900">
      <PageHeader title="Sales Analytics" subtitle="Deep dive into sales performance" />

      {/* Filters */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(Number(e.target.value) || '')}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">All</option>
              {customers?.data?.map((c: Customer) => ( // ✅ typed
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value) || '')}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">All</option>
              {products?.data?.map((p: Product) => ( // ✅ typed
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Branch / Warehouse</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value) || '')}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">All</option>
              {warehouses?.data?.map((w: Warehouse) => ( // ✅ typed
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerate}>Generate Report</Button>
            <Button variant="secondary" onClick={handleExport}>Export CSV</Button>
            <Button variant="secondary" onClick={handleSave}>Save Report</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Load Saved:</label>
            <select
              value={selectedSavedReportId}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSelectedSavedReportId(val);
                if (val) handleLoadSaved(val);
              }}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">Select a report</option>
              {savedReports?.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({new Date(r.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report content – only shown when data exists */}
      {data && (
        <>
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {(['overview', 'products', 'heatmap', 'regional'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            {activeTab === 'overview' && <OverviewTab data={data} />}
            {activeTab === 'products' && <ProductsTab data={data} />}
            {activeTab === 'heatmap' && <HeatmapTab data={data} />}
            {activeTab === 'regional' && <RegionalTab data={data} />}
          </div>
        </>
      )}
    </div>
  );
}

// ----- Tab Components (unchanged) -----

function OverviewTab({ data }: any) {
  const { summary, categoryData, orders, regionalData } = data;

  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <h3 className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Orders</p>
          <h3 className="text-2xl font-bold">{summary.totalOrders}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Avg Order Value</p>
          <h3 className="text-2xl font-bold">{formatCurrency(summary.avgOrderValue)}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Items Sold</p>
          <h3 className="text-2xl font-bold">{summary.totalItems}</h3>
        </div>
      </div>

      {/* Pie + Regional Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Sales by Category</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Top Branches</h3>
          <ul className="mt-4 space-y-2">
            {regionalData.slice(0, 5).map((r: any) => (
              <li key={r.name} className="flex justify-between border-b pb-2">
                <span>{r.name}</span>
                <span>{formatCurrency(r.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Recent Orders</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Order</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="px-4 py-2">
                    <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{order.customer.name}</td>
                  <td className="px-4 py-2 font-medium">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProductsTab({ data }: any) {
  const { topProducts, bottomProducts, growingProducts, decliningProducts } = data;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Top 5 Products (Revenue)</h3>
        <ul className="mt-4 space-y-2">
          {topProducts.map((p: any) => (
            <li key={p.name} className="flex justify-between border-b pb-2">
              <span>{p.name}</span>
              <span>{formatCurrency(p.revenue)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Bottom 5 Products (Revenue)</h3>
        <ul className="mt-4 space-y-2">
          {bottomProducts.map((p: any) => (
            <li key={p.name} className="flex justify-between border-b pb-2">
              <span>{p.name}</span>
              <span>{formatCurrency(p.revenue)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Fastest Growing</h3>
        {growingProducts.length === 0 && <p className="text-sm text-slate-500">Insufficient data</p>}
        {growingProducts.map((p: any) => (
          <div key={p.name} className="flex justify-between border-b pb-2">
            <span>{p.name}</span>
            <span className="text-emerald-600">+{p.growth.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Declining Products</h3>
        {decliningProducts.length === 0 && <p className="text-sm text-slate-500">Insufficient data</p>}
        {decliningProducts.map((p: any) => (
          <div key={p.name} className="flex justify-between border-b pb-2">
            <span>{p.name}</span>
            <span className="text-red-600">{p.growth.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapTab({ data }: any) {
  const { dayHeatmap, monthHeatmap } = data;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Sales by Day of Week</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayHeatmap}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Sales by Month</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthHeatmap}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RegionalTab({ data }: any) {
  const { regionalData } = data;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Revenue by Branch</h3>
        <ul className="mt-4 space-y-2">
          {regionalData.map((r: any) => (
            <li key={r.name} className="flex justify-between border-b pb-2">
              <span>{r.name}</span>
              <span>
                {formatCurrency(r.revenue)} ({r.orders} orders)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Profit by Branch</h3>
        <ul className="mt-4 space-y-2">
          {regionalData.map((r: any) => (
            <li key={r.name} className="flex justify-between border-b pb-2">
              <span>{r.name}</span>
              <span className={r.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                {formatCurrency(r.profit)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}