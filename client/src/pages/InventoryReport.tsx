// src/pages/InventoryReport.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useWarehouses } from '../hooks/useWarehouses';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/currency';
import { getInventoryReport } from '../api/reports';
import type { Warehouse } from '../api/warehouse';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#fb7185'];

type Tab = 'overview' | 'movement' | 'warehouse' | 'forecast' | 'suppliers';

export default function InventoryReport() {
  const today = new Date();
  const firstDay = subMonths(today, 1);
  const [startDate, setStartDate] = useState(format(firstDay, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'));
  const [warehouseId, setWarehouseId] = useState<number | ''>('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const { data: warehouses } = useWarehouses();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory-report', { startDate, endDate, warehouseId }],
    queryFn: () =>
      getInventoryReport({
        startDate,
        endDate,
        warehouseId: warehouseId || undefined,
      }),
    enabled: !!startDate && !!endDate,
  });

  const handleGenerate = () => refetch();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Inventory Report" subtitle="Comprehensive inventory health analysis" />

      {/* Filters */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-slate-700">Warehouse</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value) || '')}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">All</option>
              {warehouses?.data?.map((w: Warehouse) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleGenerate}>Generate Report</Button>
        </div>
      </div>

      {data && (
        <>
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-6">
              {(['overview', 'movement', 'warehouse', 'forecast', 'suppliers'] as Tab[]).map((tab) => (
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
            {activeTab === 'movement' && <MovementTab data={data} />}
            {activeTab === 'warehouse' && <WarehouseTab data={data} />}
            {activeTab === 'forecast' && <ForecastTab data={data} />}
            {activeTab === 'suppliers' && <SuppliersTab data={data} />}
          </div>
        </>
      )}
    </div>
  );
}

// ----- Tab Components -----

function OverviewTab({ data }: any) {
  const { summary, productStockData } = data;

  const stockStatus = [
    { name: 'Out of Stock', value: summary.outOfStockCount },
    { name: 'Low Stock', value: summary.lowStockCount },
    { name: 'In Stock', value: productStockData.length - summary.outOfStockCount - summary.lowStockCount },
  ].filter((d) => d.value > 0);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 text-slate-900">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Inventory Value</p>
          <h3 className="text-2xl font-bold">{formatCurrency(summary.totalInventoryValue)}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Available Stock</p>
          <h3 className="text-2xl font-bold">{summary.totalAvailableStock.toLocaleString()} units</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Out of Stock</p>
          <h3 className="text-2xl font-bold text-red-600">{summary.outOfStockCount}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Low Stock</p>
          <h3 className="text-2xl font-bold text-amber-600">{summary.lowStockCount}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Slow Moving Products</p>
          <h3 className="text-2xl font-bold text-slate-400">{summary.slowMoving}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Fast Moving Products</p>
          <h3 className="text-2xl font-bold text-emerald-600">{summary.fastMoving}</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Inventory Turnover</p>
          <h3 className="text-2xl font-bold">{summary.turnover.toFixed(2)}x</h3>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Shrinkage</p>
          <h3 className="text-2xl font-bold text-red-500">{(summary.shrinkage * 100).toFixed(1)}%</h3>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-900">
        <h3 className="text-sm font-semibold text-slate-500">Stock Status</h3>
        <div className="mt-4 h-64 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stockStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {stockStatus.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function MovementTab({ data }: any) {
  const { movement } = data;
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">Inbound vs Outbound (units)</h3>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={movement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="inbound" fill="#6366f1" name="Inbound (Purchases)" />
            <Bar dataKey="outbound" fill="#ec4899" name="Outbound (Sales)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function WarehouseTab({ data }: any) {
  const { warehouseCapacity } = data;
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-900">
      <h3 className="text-sm font-semibold text-slate-500">Stock by Warehouse</h3>
      <ul className="mt-4 space-y-2">
        {warehouseCapacity.length === 0 && <p className="text-slate-500">No warehouse data</p>}
        {warehouseCapacity.map((wh: any) => (
          <li key={wh.name} className="flex justify-between border-b pb-2">
            <span>{wh.name}</span>
            <span>{wh.stock} units</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ForecastTab({ data }: any) {
  const { forecast } = data;
  const critical = forecast.filter((f: any) => f.daysRemaining !== null && f.daysRemaining < 30);
  return (
    <div className="space-y-6 text-slate-900">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Days of Stock Remaining</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Stock</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Avg Daily Sales</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Days Remaining</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Predicted Stock-Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {forecast.slice(0, 20).map((f: any) => (
                <tr key={f.productId}>
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2">{f.stock}</td>
                  <td className="px-4 py-2">{f.avgDailySales.toFixed(1)}</td>
                  <td className="px-4 py-2">
                    {f.daysRemaining === null ? '∞' : f.daysRemaining < 30 ? (
                      <span className="text-red-600 font-semibold">{f.daysRemaining.toFixed(0)} days</span>
                    ) : (
                      `${f.daysRemaining.toFixed(0)} days`
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {f.predictedStockOut ? new Date(f.predictedStockOut).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {critical.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-red-700">⚠️ Critical – Stock-out within 30 days</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-red-600">
            {critical.slice(0, 10).map((f: any) => (
              <li key={f.productId}>{f.name} – {f.daysRemaining?.toFixed(0)} days left</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SuppliersTab({ data }: any) {
  const { supplierPerformance } = data;
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-900">
      <h3 className="text-sm font-semibold text-slate-500">Supplier Performance</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Supplier</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">On-Time Delivery</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Rejected Units</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Total POs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {supplierPerformance.length === 0 && <tr><td colSpan={4} className="px-4 py-2 text-slate-500">No data</td></tr>}
            {supplierPerformance.map((s: any) => (
              <tr key={s.name}>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.onTimeDeliveryRate.toFixed(0)}%</td>
                <td className="px-4 py-2">{s.rejectedQty}</td>
                <td className="px-4 py-2">{s.totalPOs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}