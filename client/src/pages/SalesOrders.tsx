// src/pages/SalesOrders.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import OrderTable from '../components/orders/OrderTable';
import OrderDrawer from '../components/orders/OrderDrawer';
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
  useApproveOrder,
  useCancelOrder,
  useOrderStats,
} from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../api/order';
import { PERMISSIONS } from '../constants/permissions';

export default function SalesOrders() {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.SALES_ORDER.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view sales orders.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useOrders(debouncedSearch, statusFilter, page);
  const { data: stats, isLoading: statsLoading } = useOrderStats();

  // 🔍 Debug log – check what the API returns
  console.log('📦 SalesOrders API response:', data);

  // Safe extraction
  const { orders, pagination } = useMemo(() => {
    if (!data) return { orders: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    if (Array.isArray(data)) {
      return { orders: data, pagination: { totalPages: 1, total: data.length, limit: data.length } };
    }
    return {
      orders: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const deleteMutation = useDeleteOrder();
  const approveMutation = useApproveOrder();
  const cancelMutation = useCancelOrder();

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
    if (!confirm('Delete this order?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Approve this order?')) return;
    await approveMutation.mutateAsync(id);
  };

  const handleCancel = async (id: number) => {
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;
    await cancelMutation.mutateAsync({ id, reason: reason || 'No reason provided' });
  };

  const openEditDrawer = (order: Order) => {
    setEditingOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingOrder(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between gap-4">
  <PageHeader
    title="Sales Orders"
    subtitle="Manage customer orders from creation to delivery."
  />

  <PermissionGate permission={PERMISSIONS.SALES_ORDER.CREATE}>
    <Button
      onClick={() => setDrawerOpen(true)}
      className="shrink-0"
    >
      <Plus size={18} />
      <span className="hidden sm:inline">
        New Order
      </span>
      <span className="sm:hidden">
        New
      </span>
    </Button>
  </PermissionGate>
</div>

      {!statsLoading && stats && (
  <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-5">

    <Stat
      label="Total"
      value={stats.totalOrders}
    />

    <Stat
      label="Pending"
      value={stats.pending}
      valueClass="text-yellow-600"
    />

    <Stat
      label="Approved"
      value={stats.approved}
      valueClass="text-blue-600"
    />

    <Stat
      label="Delivered"
      value={stats.delivered}
      valueClass="text-emerald-600"
    />

    <Stat
      label="Cancelled"
      value={stats.cancelled}
      valueClass="text-red-500"
    />

  </div>
)}

      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5">
  <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">

    <Input
      placeholder="Search by order # or customer..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
    />

    <select
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-2.5
        text-sm
        text-slate-700
        outline-none
        transition
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-100
      "
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setPage(1);
      }}
    >
      <option value="">All Statuses</option>
      <option value="PENDING">Pending</option>
      <option value="APPROVED">Approved</option>
      <option value="PROCESSING">Processing</option>
      <option value="READY_FOR_LOADING">
        Ready for Loading
      </option>
      <option value="LOADED">Loaded</option>
      <option value="DISPATCHED">Dispatched</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>

  </div>
</div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading orders...</div>
      ) : (
        <OrderTable
          orders={orders}
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

      <OrderDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingOrder}
        onSubmit={editingOrder ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
function Stat({
  label,
  value,
  valueClass = "text-slate-900",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <p className="text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </p>

      <h3
        className={`mt-1 text-2xl font-bold tracking-tight sm:mt-2 sm:text-3xl ${valueClass}`}
      >
        {value.toLocaleString()}
      </h3>
    </div>
  );
}