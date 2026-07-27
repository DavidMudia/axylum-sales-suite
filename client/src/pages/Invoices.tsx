// src/pages/Invoices.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import InvoiceTable from '../components/invoices/InvoiceTable';
import InvoiceDrawer from '../components/invoices/InvoiceDrawer';
import {
  useInvoices,
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
  useApproveInvoice,
  useMarkInvoicePrinted,
  useInvoiceStats,
} from '../hooks/useInvoices';
import { useAuth } from '../context/AuthContext';
import type { Invoice } from '../api/invoice';
import { PERMISSIONS } from '../constants/permissions';

export default function Invoices() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.INVOICE.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view invoices.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useInvoices(debouncedSearch, statusFilter, page);
  const { data: stats, isLoading: statsLoading } = useInvoiceStats();

  const { invoices, pagination } = useMemo(() => {
    if (!data) return { invoices: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    if (Array.isArray(data)) {
      return { invoices: data, pagination: { totalPages: 1, total: data.length, limit: data.length } };
    }
    return {
      invoices: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const deleteMutation = useDeleteInvoice();
  const approveMutation = useApproveInvoice();
  const printMutation = useMarkInvoicePrinted();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingInvoice) return;
    await updateMutation.mutateAsync({ id: editingInvoice.id, data: formData });
    setDrawerOpen(false);
    setEditingInvoice(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this invoice?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleApprove = async (id: number) => {
    const note = prompt('Approval note (optional):');
    if (note === null) return;
    await approveMutation.mutateAsync({ id, note: note || undefined });
  };

  const handlePrint = async (id: number) => {
    try {
      await printMutation.mutateAsync(id);
      // Open print dialog after marking as printed
      window.open(`/invoices/${id}/print`, '_blank');
    } catch (error) {
      alert('Failed to mark invoice as printed.');
    }
  };

  const openEditDrawer = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingInvoice(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Invoices" subtitle="Manage customer invoices and track payments." />
        <PermissionGate permission={PERMISSIONS.INVOICE.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> New Invoice
          </Button>
        </PermissionGate>
      </div>

      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalInvoices}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Unpaid</p>
            <h3 className="mt-2 text-2xl font-bold text-red-600">{stats.unpaid}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Partial</p>
            <h3 className="mt-2 text-2xl font-bold text-yellow-600">{stats.partial}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Paid</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.paid}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Revenue</p>
            <h3 className="mt-2 text-2xl font-bold text-indigo-600">₦{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by invoice # or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading invoices...</div>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onEdit={openEditDrawer}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onPrint={handlePrint}
        />
      )}

      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <InvoiceDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingInvoice}
        onSubmit={editingInvoice ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}