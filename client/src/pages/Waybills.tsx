// src/pages/Waybills.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import WaybillTable from '../components/waybills/WaybillTable';
import { useWaybills, useWaybillStats } from '../hooks/useWaybills';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../constants/permissions';

export default function Waybills() {
  const navigate = useNavigate(); // ✅ ADD THIS
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.WAYBILL.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view waybills.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useWaybills(debouncedSearch, statusFilter, page);
  const { data: stats, isLoading: statsLoading } = useWaybillStats();

  const { waybills, pagination } = useMemo(() => {
    if (!data) return { waybills: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    if (Array.isArray(data)) {
      return { waybills: data, pagination: { totalPages: 1, total: data.length, limit: data.length } };
    }
    return {
      waybills: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Waybills" subtitle="Manage delivery waybills for customer orders." />
        <PermissionGate permission={PERMISSIONS.WAYBILL.CREATE}>
          <Button onClick={() => navigate('/waybills/new')}>
            <Plus size={18} /> New Waybill
          </Button>
        </PermissionGate>
      </div>

      {/* stats and table as before... */}
      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalWaybills}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h3 className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">In Transit</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-600">{stats.inTransit}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Delivered</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.delivered}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by waybill # or destination..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="LOADING">Loading</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading waybills...</div>
      ) : (
        <WaybillTable waybills={waybills} />
      )}

      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />
    </div>
  );
}