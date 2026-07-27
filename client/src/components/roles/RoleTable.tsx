// src/components/roles/RoleTable.tsx
import { Edit, Trash2, Shield } from 'lucide-react';
import type { Role } from '../../api/role';

type Props = {
  roles: Role[];
  onEdit?: (role: Role) => void;
  onDelete?: (id: number) => void;
};

export default function RoleTable({ roles, onEdit, onDelete }: Props) {
  if (roles.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
        <p className="text-slate-500">No roles found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Permissions</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Users</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">System</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{role.displayName}</div>
                    <div className="text-xs text-slate-500">{role.name}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {role.description || '—'}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {role.rolePermissions.length === 0 && (
                    <span className="text-xs text-slate-400">No permissions</span>
                  )}
                  {role.rolePermissions.slice(0, 5).map((rp) => (
                    <span
                      key={rp.permission.id}
                      className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {rp.permission.name}
                    </span>
                  ))}
                  {role.rolePermissions.length > 5 && (
                    <span className="text-xs text-slate-400">+{role.rolePermissions.length - 5} more</span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {role.users?.length || 0}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {role.isSystem ? (
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    System
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Custom</span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                {!role.isSystem && (
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(role)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(role.id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}