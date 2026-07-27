// src/pages/Customers.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerDrawer from '../components/customers/CustomerDrawer';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useCustomerStats,
} from '../hooks/useCustomers';
import { useAuth } from '../context/AuthContext';
import type { Customer } from '../api/customer';
import { PERMISSIONS } from '../constants/permissions';
import { formatCurrency } from '../utils/currency';

export default function Customers() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.CUSTOMER.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-slate-900">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view customers.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useCustomers(debouncedSearch, page);
  const { data: stats, isLoading: statsLoading } = useCustomerStats();

  const customers = useMemo(() => data?.data ?? [], [data]);

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingCustomer) return;
    await updateMutation.mutateAsync({ id: editingCustomer.id, data: formData });
    setDrawerOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const openEditDrawer = (customer: Customer) => {
    setEditingCustomer(customer);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCustomer(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader
          title="Customers"
          subtitle="Manage your customer relationships and track outstanding balances."
        />
        <PermissionGate permission={PERMISSIONS.CUSTOMER.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} />
            New Customer
          </Button>
        </PermissionGate>
      </div>

      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalCustomers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.activeCustomers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Inactive</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-400">{stats.inactiveCustomers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Blocked</p>
            <h3 className="mt-2 text-2xl font-bold text-red-500">{stats.blockedCustomers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Outstanding</p>
            <h3 className="mt-2 text-2xl font-bold text-indigo-600">{formatCurrency(stats.totalOutstanding)}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Input
            placeholder="Search by name, company, phone, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading customers...</div>
      ) : (
        <CustomerTable customers={customers} onEdit={openEditDrawer} onDelete={handleDelete} />
      )}

      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        total={data?.pagination.total ?? 0}
        limit={data?.pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <CustomerDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingCustomer}
        onSubmit={editingCustomer ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}