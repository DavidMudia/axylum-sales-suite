// src/components/users/UserDrawer.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { User } from '../../api/user';
import { useRoles } from '../../hooks/useRoles';

const userSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  roleId: z.number().int().positive(),
  employeeNumber: z.string().min(1).max(50).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().optional(),
  loginAllowedFromMobile: z.boolean(), // ✅ required (no default)
  loginAllowedFromDesktop: z.boolean(), // ✅ required
  adminPassword: z.string().min(1, 'Admin password is required'),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof userSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: User | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function UserDrawer({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const { data: rolesData } = useRoles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      loginAllowedFromMobile: true,
      loginAllowedFromDesktop: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone || '',
        roleId: initialData.roleId,
        employeeNumber: initialData.employeeNumber,
        loginAllowedFromMobile: initialData.loginAllowedFromMobile,
        loginAllowedFromDesktop: initialData.loginAllowedFromDesktop,
        password: '',
        confirmPassword: '',
        adminPassword: '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        roleId: undefined,
        employeeNumber: '',
        loginAllowedFromMobile: true,
        loginAllowedFromDesktop: true,
        password: '',
        confirmPassword: '',
        adminPassword: '',
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {initialData ? 'Edit User' : 'New User'}
              </h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">First Name *</label>
                    <Input {...register('firstName')} error={errors.firstName?.message} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Last Name *</label>
                    <Input {...register('lastName')} error={errors.lastName?.message} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email *</label>
                  <Input type="email" {...register('email')} error={errors.email?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone</label>
                  <Input {...register('phone')} error={errors.phone?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Employee Number</label>
                  <Input {...register('employeeNumber')} error={errors.employeeNumber?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Role *</label>
                  <select
                    {...register('roleId', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  >
                    <option value="">Select role</option>
                    {rolesData?.data?.map((role) => (
                      <option key={role.id} value={role.id}>{role.displayName}</option>
                    ))}
                  </select>
                  {errors.roleId && <p className="mt-1 text-sm text-red-600">{errors.roleId.message}</p>}
                </div>

                {/* Password fields – only for new user */}
                {!initialData && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Password *</label>
                      <Input type="password" {...register('password')} error={errors.password?.message} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Confirm Password *</label>
                      <Input type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
                    </div>
                  </>
                )}

                {/* Login restrictions */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Login Restrictions</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" {...register('loginAllowedFromMobile')} />
                      Mobile
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" {...register('loginAllowedFromDesktop')} />
                      Desktop
                    </label>
                  </div>
                </div>

                {/* Admin password confirmation */}
                <div className="border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Your password to confirm</label>
                    <Input
                      type="password"
                      {...register('adminPassword')}
                      error={errors.adminPassword?.message}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')} User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}