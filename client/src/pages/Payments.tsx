// src/pages/Payments.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import PaymentTable from '../components/payments/PaymentTable';
import PaymentDrawer from '../components/payments/PaymentDrawer';
import {
  usePayments,
  useCreatePayment,
  useUpdatePayment,
  useDeletePayment,
  useApprovePayment,
  useCancelPayment,
  usePaymentStats,
} from '../hooks/usePayments';
import { useAuth } from '../context/AuthContext';
import type { Payment } from '../api/payment';
import { PERMISSIONS } from '../constants/permissions';
import { formatCurrency } from '../utils/currency';

export default function Payments() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.PAYMENT.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view payments.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = usePayments(
  debouncedSearch,
  statusFilter,
  false,
  page
);
  const { data: stats, isLoading: statsLoading } = usePaymentStats();

  const { payments, pagination } = useMemo(() => {
    if (!data) return { payments: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    if (Array.isArray(data)) {
      return { payments: data, pagination: { totalPages: 1, total: data.length, limit: data.length } };
    }
    return {
      payments: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  const createMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();
  const deleteMutation = useDeletePayment();
  const approveMutation = useApprovePayment();
  const cancelMutation = useCancelPayment();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingPayment) return;
    await updateMutation.mutateAsync({ id: editingPayment.id, data: formData });
    setDrawerOpen(false);
    setEditingPayment(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this payment?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Approve this payment?')) return;
    await approveMutation.mutateAsync(id);
  };

  const handleCancel = async (id: number) => {
  const reason = prompt('Reason for cancelling this payment?');

  if (reason === null) return; // user pressed Cancel

  await cancelMutation.mutateAsync({
    id,
    reason: reason.trim() || 'No reason provided',
  });
};

  const openEditDrawer = (payment: Payment) => {
    setEditingPayment(payment);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingPayment(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Payments" subtitle="Record and manage customer payments." />
        <PermissionGate permission={PERMISSIONS.PAYMENT.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> Record Payment
          </Button>
        </PermissionGate>
      </div>

      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5 text-slate-900">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalPayments}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.completedPayments}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h3 className="mt-2 text-2xl font-bold text-yellow-600">{stats.pendingPayments}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount</p>
            <h3 className="mt-2 text-2xl font-bold text-indigo-600">{formatCurrency(stats.totalRevenue)}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by payment #, invoice #, or customer..."
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
            <option value="COMPLETED">Completed</option>
          
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading payments...</div>
      ) : (
        <PaymentTable
          payments={payments}
          onEdit={openEditDrawer}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onCancel={handleCancel}
        />
      )}

      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <PaymentDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingPayment}
        onSubmit={editingPayment ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}