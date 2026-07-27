// src/pages/Refunds.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import RefundTable from '../components/refunds/RefundTable';
import RefundDrawer from '../components/refunds/RefundDrawer';
import {
  useRefunds,
  useCreateRefund,
  useApproveRefund,
  useRejectRefund,
  useRefundStats,
} from '../hooks/useRefunds';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../constants/permissions';
import { formatCurrency } from '../utils/currency';

export default function Refunds() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.REFUND.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view refunds.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useRefunds(debouncedSearch, statusFilter, page);
  const { data: stats, isLoading: statsLoading } = useRefundStats();

  const { refunds, pagination } = useMemo(() => {
    if (!data) return { refunds: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    if (Array.isArray(data)) {
      return { refunds: data, pagination: { totalPages: 1, total: data.length, limit: data.length } };
    }
    return {
      refunds: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  const createMutation = useCreateRefund();
  const approveMutation = useApproveRefund();
  const rejectMutation = useRejectRefund();

  const handleCreate = async (formData: any) => {
  try {
    console.log("Submitting refund:", formData);

    const result = await createMutation.mutateAsync(formData);

    console.log("Refund created:", result);

    setDrawerOpen(false);
  } catch (err) {
    console.error("Refund error:", err);
  }
};
  const handleApprove = async (id: number) => {
    const note = prompt('Approval note (optional):');
    if (note === null) return;
    await approveMutation.mutateAsync({ id, note: note || undefined });
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Rejection reason:');
    if (reason === null) return;
    await rejectMutation.mutateAsync({ id, reason });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const isSubmitting = createMutation.isPending;

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Refunds" subtitle="Manage customer refunds and track approval status." />
        <PermissionGate permission={PERMISSIONS.REFUND.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> Request Refund
          </Button>
        </PermissionGate>
      </div>

      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 text-slate-900">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalRefunds}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h3 className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.approved}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount</p>
            <h3 className="mt-2 text-2xl font-bold text-indigo-600">{formatCurrency(stats.totalAmount)}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by refund # or reason..."
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
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading refunds...</div>
      ) : (
        <RefundTable
          refunds={refunds}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <RefundDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}