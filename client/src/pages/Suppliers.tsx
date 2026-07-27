import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import SupplierTable from '../components/suppliers/SupplierTable';
import SupplierDrawer from '../components/suppliers/SupplierDrawer';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useSupplierStats,    // ✅ new
} from '../hooks/useSuppliers';
import { useAuth } from '../context/AuthContext';
import type { Supplier, SuppliersResponse } from '../api/supplier';
import { PERMISSIONS } from '../constants/permissions';

export default function Suppliers() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.SUPPLIER.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-slate-900">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">
          You don't have permission to view suppliers.
        </p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const debouncedSearch = useDebounce(search);

  // Main list data
  const { data, isLoading } = useSuppliers(debouncedSearch, page) as {
    data: SuppliersResponse | undefined;
    isLoading: boolean;
  };
  const suppliers = useMemo(() => data?.data ?? [], [data]);

  // Stats
  const { data: stats, isLoading: statsLoading } = useSupplierStats();

  // Mutations
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingSupplier) return;
    await updateMutation.mutateAsync({ id: editingSupplier.id, data: formData });
    setDrawerOpen(false);
    setEditingSupplier(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const openEditDrawer = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingSupplier(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between text-slate-900">
        <PageHeader
          title="Suppliers"
          subtitle="Manage your suppliers and vendor relationships."
        />
        <PermissionGate permission={PERMISSIONS.SUPPLIER.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} />
            New Supplier
          </Button>
        </PermissionGate>
      </div>

      {/* Statistics Bar */}
      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5 text-slate-900">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Suppliers</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalSuppliers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.activeSuppliers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Inactive</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-400">{stats.inactiveSuppliers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Purchase Orders</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalPurchaseOrders}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Goods Receipts</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalGoodsReceipts}</h3>
          </div>
        </div>
      )}

      {/* Filters */}
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

      {/* Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
          Loading suppliers...
        </div>
      ) : (
        <SupplierTable
          suppliers={suppliers}
          onEdit={openEditDrawer}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        total={data?.pagination.total ?? 0}
        limit={data?.pagination.limit ?? 20}
        onPageChange={setPage}
      />

      {/* Drawer */}
      <SupplierDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingSupplier}
        onSubmit={editingSupplier ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}