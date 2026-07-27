// src/pages/Roles.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import PermissionGate from '../components/auth/PermissionGate';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import RoleTable from '../components/roles/RoleTable';
import RoleDrawer from '../components/roles/RoleDrawer';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '../hooks/useRoles';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../constants/permissions';

export default function Roles() {
  const { hasPermission, user } = useAuth();

  if (!hasPermission(PERMISSIONS.ROLE.READ)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-semibold text-red-700">Access Denied</h2>
        <p className="mt-2 text-red-600">You don't have permission to view roles.</p>
      </div>
    );
  }

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);

  const { data, isLoading } = useRoles();
  const roles = useMemo(() => data?.data ?? [], [data]);

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    setDrawerOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingRole) return;
    await updateMutation.mutateAsync({ id: editingRole.id, data: formData });
    setDrawerOpen(false);
    setEditingRole(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this role?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const openEditDrawer = (role: any) => {
    setEditingRole(role);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingRole(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // ✅ Safely extract role name from user (handles both string and object)
  const userRoleName = (() => {
    if (!user) return '';
    // @ts-ignore – role might be string or object
    return typeof user.role === 'string' ? user.role : user.role?.name || '';
  })();

  const canManage = userRoleName === 'SUPER_ADMIN';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Roles" subtitle="Manage system roles and their permissions." />
        {canManage && (
          <PermissionGate permission={PERMISSIONS.ROLE.CREATE}>
            <Button onClick={() => setDrawerOpen(true)}>
              <Plus size={18} /> New Role
            </Button>
          </PermissionGate>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">Loading roles...</div>
      ) : (
        <RoleTable
          roles={roles}
          onEdit={canManage ? openEditDrawer : undefined}
          onDelete={canManage ? handleDelete : undefined}
        />
      )}

      <RoleDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        initialData={editingRole}
        onSubmit={editingRole ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}