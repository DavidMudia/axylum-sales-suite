import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseDrawer from '../components/expenses/ExpenseDrawer';
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useExpenseStats,
} from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import type { Expense } from '../api/expense';
import { PERMISSIONS } from '../constants/permissions';
import { formatCurrency } from '../utils/currency';

const CATEGORY_OPTIONS = ['All', 'TRANSPORTATION', 'FUEL', 'STAFF', 'REPAIRS', 'MARKETING', 'UTILITIES', 'OTHER'];

export default function Expenses() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.EXPENSES.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view expenses.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useExpenses(debouncedSearch, categoryFilter, undefined, undefined, page);
  const { data: stats } = useExpenseStats();

  const expenses = useMemo(() => data?.data ?? [], [data]);

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingExpense) return;
    await updateMutation.mutateAsync({ id: editingExpense.id, data: formData });
    setDrawerOpen(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this expense?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const openEditDrawer = (expense: Expense) => {
    setEditingExpense(expense);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingExpense(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Expenses" subtitle="Track day-to-day business expenses" />
        <PermissionGate permission={PERMISSIONS.EXPENSES.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> New Expense
          </Button>
        </PermissionGate>
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Expenses</p>
            <h3 className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Number of Expenses</p>
            <h3 className="text-2xl font-bold">{stats.totalCount}</h3>
          </div>
          {stats.categoryStats.slice(0, 2).map((c) => (
            <div key={c.category} className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{c.category}</p>
              <h3 className="text-2xl font-bold">{formatCurrency(c._sum.amount)}</h3>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading expenses...</div>
      ) : (
        <ExpenseTable expenses={expenses} onEdit={openEditDrawer} onDelete={handleDelete} />
      )}

      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        total={data?.pagination.total ?? 0}
        limit={data?.pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <ExpenseDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingExpense}
        onSubmit={editingExpense ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}