import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Supplier } from '../../api/supplier';

// Local status enum – matches backend
const SupplierStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

type SupplierStatusType = (typeof SupplierStatus)[keyof typeof SupplierStatus];

// ✅ status is required (no .default()) – we provide it in defaultValues
const supplierSchema = z.object({
  name: z.string().min(2).max(200),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(5),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type FormData = z.infer<typeof supplierSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Supplier | null;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
};

export default function SupplierDrawer({
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
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      phone: '',
      companyName: '',
      contactPerson: '',
      email: '',
      address: '',
      city: '',
      state: '',
      country: '',
      notes: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        companyName: initialData.companyName || '',
        contactPerson: initialData.contactPerson || '',
        email: initialData.email || '',
        phone: initialData.phone,
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || '',
        notes: initialData.notes || '',
        status: initialData.status as SupplierStatusType,
      });
    } else {
      reset({
        status: 'ACTIVE',
        name: '',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        notes: '',
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {initialData ? 'Edit Supplier' : 'New Supplier'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Name *
                  </label>
                  <Input
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Supplier name"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Company Name
                  </label>
                  <Input
                    {...register('companyName')}
                    error={errors.companyName?.message}
                    placeholder="Company name"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Contact Person
                  </label>
                  <Input
                    {...register('contactPerson')}
                    error={errors.contactPerson?.message}
                    placeholder="Contact person"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <Input
                    {...register('email')}
                    error={errors.email?.message}
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Phone *
                  </label>
                  <Input
                    {...register('phone')}
                    error={errors.phone?.message}
                    placeholder="Phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <Input
                    {...register('address')}
                    error={errors.address?.message}
                    placeholder="Street address"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <Input
                    {...register('city')}
                    error={errors.city?.message}
                    placeholder="City"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    State
                  </label>
                  <Input
                    {...register('state')}
                    error={errors.state?.message}
                    placeholder="State"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <Input
                    {...register('country')}
                    error={errors.country?.message}
                    placeholder="Country"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional notes"
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button type="button" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')} Supplier
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}