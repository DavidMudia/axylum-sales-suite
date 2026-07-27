// src/pages/Quotes.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import QuoteTable from '../components/quotes/QuoteTable';
import QuoteDrawer from '../components/quotes/QuoteDrawer';
import {
  useQuotes,
  useCreateQuote,
  useUpdateQuote,
  useDeleteQuote,
  useApproveQuote,
  useRejectQuote,
  useQuoteStats,
} from '../hooks/useQuotes';
import { useAuth } from '../context/AuthContext';
import type { Quote } from '../api/quote';
import { PERMISSIONS } from '../constants/permissions';

export default function Quotes() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.QUOTE.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view quotes.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useQuotes(debouncedSearch, statusFilter, page);
  const { data: stats, isLoading: statsLoading } = useQuoteStats();

  // ✅ Safe extraction of orders and pagination
  const { quotes, pagination } = useMemo(() => {
    if (!data) {
      return { quotes: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    }
    // If data is an array (backend returns list directly)
    if (Array.isArray(data)) {
      return {
        quotes: data,
        pagination: { totalPages: 1, total: data.length, limit: data.length },
      };
    }
    // If data has the expected shape { data: [], pagination: {} }
    return {
      quotes: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  const createMutation = useCreateQuote();
  const updateMutation = useUpdateQuote();
  const deleteMutation = useDeleteQuote();
  const approveMutation = useApproveQuote();
  const rejectMutation = useRejectQuote();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingQuote) return;
    await updateMutation.mutateAsync({ id: editingQuote.id, data: formData });
    setDrawerOpen(false);
    setEditingQuote(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this quote?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Approve this quote?')) return;
    await approveMutation.mutateAsync(id);
  };

  const handleReject = async (id: number) => {
    const note = prompt('Rejection reason:');
    if (note === null) return;
    await rejectMutation.mutateAsync({ id, note: note || 'No reason provided' });
  };

  const openEditDrawer = (quote: Quote) => {
    setEditingQuote(quote);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingQuote(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Quotes" subtitle="Create and manage customer quotes." />
        <PermissionGate permission={PERMISSIONS.QUOTE.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> New Quote
          </Button>
        </PermissionGate>
      </div>

      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalQuotes}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Draft</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-400">{stats.draftQuotes}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Sent</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-600">{stats.sentQuotes}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Accepted</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.acceptedQuotes}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Rejected</p>
            <h3 className="mt-2 text-2xl font-bold text-red-500">{stats.rejectedQuotes}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Value</p>
            <h3 className="mt-2 text-2xl font-bold text-indigo-600">₦{stats.totalValue.toLocaleString()}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by quote # or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading quotes...</div>
      ) : (
        <QuoteTable
          quotes={quotes}
          onEdit={openEditDrawer}
          onDelete={handleDelete}
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

      <QuoteDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingQuote}
        onSubmit={editingQuote ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}