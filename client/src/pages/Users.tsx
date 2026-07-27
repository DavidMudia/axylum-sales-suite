// src/pages/Users.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import UserTable from '../components/users/UserTable';
import UserDrawer from '../components/users/UserDrawer';
import UserDetailDrawer from '../components/users/UserDetailDrawer';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useUserStats,
} from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import type { User } from '../api/user';
import { PERMISSIONS } from '../constants/permissions';

export default function Users() {
  const { hasPermission, user: currentUser } = useAuth();

  if (!hasPermission(PERMISSIONS.USER.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view users.</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useUsers(debouncedSearch, page);
  const { data: stats, isLoading: statsLoading } = useUserStats();

  // Safe extraction
  const { users, pagination } = useMemo(() => {
    if (!data) return { users: [], pagination: { totalPages: 1, total: 0, limit: 20 } };
    if (Array.isArray(data)) {
      return { users: data, pagination: { totalPages: 1, total: data.length, limit: data.length } };
    }
    return {
      users: data.data ?? [],
      pagination: data.pagination ?? { totalPages: 1, total: 0, limit: 20 },
    };
  }, [data]);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingUser) return;
    await updateMutation.mutateAsync({ id: editingUser.id, data: formData });
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleActivate = async (id: number) => {
    await activateMutation.mutateAsync(id);
    // close detail drawer if open
    if (detailDrawerOpen) {
      setDetailDrawerOpen(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('Deactivate this user?')) return;
    await deactivateMutation.mutateAsync(id);
    if (detailDrawerOpen) {
      setDetailDrawerOpen(false);
    }
  };

  const openEditDrawer = (user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const openDetailDrawer = (user: User) => {
    setViewingUser(user);
    setDetailDrawerOpen(true);
  };

  const closeDetailDrawer = () => {
    setDetailDrawerOpen(false);
    setViewingUser(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Determine if current user can change status of a target user
  const canChangeStatus = (targetUser: User) => {
    if (!currentUser) return false;

    // ✅ Safe extraction using type guards
    const currentRole = currentUser.role;
    const targetRole = targetUser.role;

    // Handle role being a string, an object with name, or undefined
    const getRoleName = (role: any): string => {
      if (!role) return '';
      if (typeof role === 'string') return role;
      if (role && typeof role === 'object' && 'name' in role) {
        return role.name || '';
      }
      return '';
    };

    const currentRoleName = getRoleName(currentRole);
    const targetRoleName = getRoleName(targetRole);

    if (currentRoleName === 'SUPER_ADMIN') return true;
    if (currentRoleName === 'ADMIN') {
      if (targetRoleName === 'SUPER_ADMIN' || targetRoleName === 'ADMIN') return false;
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Users" subtitle="Manage system users and their roles." />
        <PermissionGate permission={PERMISSIONS.USER.CREATE}>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> New User
          </Button>
        </PermissionGate>
      </div>

      {!statsLoading && stats && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <h3 className="mt-2 text-2xl font-bold">{stats.totalUsers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{stats.activeUsers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Inactive</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-400">{stats.inactiveUsers}</h3>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Locked</p>
            <h3 className="mt-2 text-2xl font-bold text-red-500">{stats.lockedUsers}</h3>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <Input
          placeholder="Search by name, email, employee number..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading users...</div>
      ) : (
        <UserTable
          users={users}
          onView={openDetailDrawer}
          onEdit={openEditDrawer}
          onDelete={handleDelete}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          canChangeStatus={canChangeStatus}
        />
      )}

      <Pagination
        page={page}
        totalPages={pagination.totalPages ?? 1}
        total={pagination.total ?? 0}
        limit={pagination.limit ?? 20}
        onPageChange={setPage}
      />

      <UserDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingUser}
        onSubmit={editingUser ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />

      <UserDetailDrawer
        open={detailDrawerOpen}
        onClose={closeDetailDrawer}
        user={viewingUser}
        onEdit={openEditDrawer}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        canChangeStatus={canChangeStatus}
      />
    </div>
  );
}