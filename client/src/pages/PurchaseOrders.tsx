// src/pages/PurchaseOrders.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import PurchaseOrderTable from '../components/purchase-orders/PurchaseOrderTable';
import PurchaseOrderDrawer from '../components/purchase-orders/PurchaseOrderDrawer';
import {
  usePurchaseOrders,
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useDeletePurchaseOrder,
  usePurchaseOrderStats,
  useApprovePurchaseOrder,   // ✅ added
} from '../hooks/usePurchaseOrders';
import { useAuth } from '../context/AuthContext';
import type { PurchaseOrder } from '../api/purchase-order';
import { PERMISSIONS } from '../constants/permissions';

export default function PurchaseOrders() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.PURCHASE_ORDER.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view purchase orders.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = usePurchaseOrders(debouncedSearch, statusFilter, page);
  const { data: stats, isLoading: statsLoading } = usePurchaseOrderStats();

  // Safely extract orders and pagination
  const { orders, pagination } = useMemo(() => {
    if (!data) {
      return { orders: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    }
    if (Array.isArray(data)) {
      return {
        orders: data,
        pagination: { totalPages: 1, total: data.length, limit: data.length },
      };
    }
    return {
      orders: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  // Mutations
  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();
  const deleteMutation = useDeletePurchaseOrder();
  const approveMutation = useApprovePurchaseOrder();   // ✅ added

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingOrder) return;
    await updateMutation.mutateAsync({ id: editingOrder.id, data: formData });
    setDrawerOpen(false);
    setEditingOrder(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this purchase order?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleApprove = async (id: number) => {   // ✅ added
    if (!confirm('Approve this purchase order?')) return;
    try {
      await approveMutation.mutateAsync(id);
    } catch (error) {
      alert('Failed to approve purchase order.');
    }
  };

  const openEditDrawer = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingOrder(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader
          title="Purchase Orders"
          subtitle="Manage supplier purchase orders and track deliveries."
        />
        <PermissionGate permission={PERMISSIONS.PURCHASE_ORDER.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} />
            New Purchase Order
          </Button>
        </PermissionGate>
      </div>

      {/* Statistics Bar */}
      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
            <p className="text-sm text-slate-800">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalOrders}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Draft</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-400">{stats.draft}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending Approval</p>
            <h3 className="mt-2 text-2xl font-bold text-yellow-600">{stats.pendingApproval}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-600">{stats.approved}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Received</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.received}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Cancelled</p>
            <h3 className="mt-2 text-2xl font-bold text-red-500">{stats.cancelled}</h3>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 ">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by PO number or supplier..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="PARTIALLY_RECEIVED">Partially Received</option>
            <option value="RECEIVED">Received</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
          Loading purchase orders...
        </div>
      ) : (
        <PurchaseOrderTable
          orders={orders}
          onEdit={openEditDrawer}
          onDelete={handleDelete}
          onApprove={handleApprove}   // ✅ added
        />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />

      {/* Drawer */}
      <PurchaseOrderDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingOrder}
        onSubmit={editingOrder ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}