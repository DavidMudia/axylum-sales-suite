// src/components/roles/RoleDrawer.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const roleSchema = z.object({
  name: z.string().min(2).max(50),
  displayName: z.string().min(2).max(100),
  description: z.string().optional(),
  adminPassword: z.string().min(1, 'Admin password is required'),
});

type FormData = z.infer<typeof roleSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: any | null;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
};

export default function RoleDrawer({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roleSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        adminPassword: '',
      });
    } else {
      reset({
        name: '',
        displayName: '',
        description: '',
        adminPassword: '',
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {initialData ? 'Edit Role' : 'New Role'}
              </h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Role Name (system) *</label>
                  <Input
                    {...register('name')}
                    placeholder="e.g., MANAGER"
                    disabled={!!initialData}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Display Name *</label>
                  <Input {...register('displayName')} placeholder="e.g., Manager" />
                  {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <Input {...register('description')} placeholder="Brief description of this role" />
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Confirm with your password *
                  </label>
                  <Input
                    type="password"
                    {...register('adminPassword')}
                    placeholder="Enter your password"
                  />
                  {errors.adminPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')} Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}