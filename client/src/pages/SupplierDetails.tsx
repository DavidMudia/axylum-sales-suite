import { useParams } from 'react-router-dom';
import { useSupplier, useSupplierStatsById } from '../hooks/useSuppliers';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SupplierDetails() {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);

  // Supplier data (name, contact, etc.)
  const { data: supplier, isLoading: supplierLoading } = useSupplier(supplierId);

  // Supplier statistics (orders, receipts, monthly breakdown)
  const { data: stats, isLoading: statsLoading } = useSupplierStatsById(supplierId);

  if (supplierLoading || statsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        Supplier not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-900">
      <PageHeader title={supplier.name} subtitle={supplier.companyName || 'No company'} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Contact Information</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Contact Person</dt>
              <dd className="font-medium">{supplier.contactPerson || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium">{supplier.email || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium">{supplier.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Address</dt>
              <dd className="font-medium">
                {[supplier.address, supplier.city, supplier.state, supplier.country]
                  .filter(Boolean)
                  .join(', ') || '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor(
                    supplier.status
                  )}`}
                >
                  {supplier.status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(supplier.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        {/* Activity Summary */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Activity Summary</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Purchase Orders</p>
              <p className="text-3xl font-bold text-indigo-600">
                {stats?.totalPurchaseOrders ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Goods Receipts</p>
              <p className="text-3xl font-bold text-emerald-600">
                {stats?.totalGoodsReceipts ?? 0}
              </p>
            </div>
            <div className="col-span-2 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total Items Received</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.totalItemsReceived ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly delivery frequency chart */}
      {stats?.monthlyReceipts && stats.monthlyReceipts.length > 0 && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">
            Monthly Delivery Frequency (last 12 months)
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyReceipts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}