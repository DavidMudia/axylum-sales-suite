// src/components/users/UserDetailDrawer.tsx
import { X, User as UserIcon } from 'lucide-react';
import type { User as UserType } from '../../api/user';
import Button from '../ui/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
  onEdit: (user: UserType) => void;
  onDelete: (id: number) => void;        // ✅ added
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  canChangeStatus: (user: UserType) => boolean;
};

export default function UserDetailDrawer({
  open,
  onClose,
  user,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  canChangeStatus,
}: Props) {
  if (!open || !user) return null;

  const canChange = canChangeStatus(user);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.firstName} className="h-10 w-10 rounded-full" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <UserIcon size={20} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-slate-500">{user.employeeNumber}</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <dl className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Email</dt>
                    <dd className="font-medium">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Phone</dt>
                    <dd className="font-medium">{user.phone || '—'}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Role</dt>
                    <dd className="font-medium">{user.role?.displayName || user.role?.name || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Status</dt>
                    <dd className={`font-medium ${user.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Mobile Login</dt>
                    <dd className="font-medium">{user.loginAllowedFromMobile ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Desktop Login</dt>
                    <dd className="font-medium">{user.loginAllowedFromDesktop ? 'Yes' : 'No'}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Must Change Password</dt>
                    <dd className="font-medium">{user.mustChangePassword ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-slate-400">Created</dt>
                    <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 p-6 text-slate-900">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    onClose();
                    onEdit(user);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </Button>
                {canChange && (
                  <>
                    {user.isActive ? (
                      <Button
                        onClick={() => {
                          onClose();
                          onDeactivate(user.id);
                        }}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          onClose();
                          onActivate(user.id);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Activate
                      </Button>
                    )}
                  </>
                )}
                <Button
                  onClick={() => {
                    if (confirm('Delete this user?')) {
                      onClose();
                      onDelete(user.id);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}