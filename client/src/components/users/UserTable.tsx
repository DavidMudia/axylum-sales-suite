// src/components/users/UserTable.tsx
import { Edit, Trash2, CheckCircle, XCircle, UserCog, User as UserIcon } from 'lucide-react';
import type { User as UserType } from '../../api/user';

type Props = {
  users: UserType[];
  onView: (user: UserType) => void;   // ✅ added
  onEdit: (user: UserType) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  canChangeStatus: (user: UserType) => boolean;
};

export default function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  canChangeStatus,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
        <p className="text-slate-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white text-slate-900">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.firstName} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <UserIcon size={16} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{user.employeeNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {user.role?.displayName || user.role?.name || '—'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(user)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <UserCog size={16} />
                    </button>
                    {canChangeStatus(user) && (
                      <>
                        {user.isActive ? (
                          <button
                            onClick={() => onDeactivate(user.id)}
                            className="rounded-lg p-1 text-amber-500 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onActivate(user.id)}
                            className="rounded-lg p-1 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </>
                    )}
                    <button onClick={() => onEdit(user)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(user.id)} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 lg:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.firstName} className="h-12 w-12 rounded-full" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <UserIcon size={20} />
                  </div>
                )}
                <div>
                  <div className="font-medium text-slate-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-500">{user.employeeNumber}</div>
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase text-slate-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Role</p>
                <p className="font-medium">{user.role?.displayName || user.role?.name || '—'}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onView(user)}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
              >
                <UserCog size={14} /> View
              </button>
              {canChangeStatus(user) && (
                <>
                  {user.isActive ? (
                    <button
                      onClick={() => onDeactivate(user.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 hover:bg-amber-100"
                    >
                      <XCircle size={14} /> Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(user.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                    >
                      <CheckCircle size={14} /> Activate
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => onEdit(user)}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}