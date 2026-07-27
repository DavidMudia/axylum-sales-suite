import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Expense } from '../../api/expense';
import { format } from 'date-fns';

const expenseSchema = z.object({
  description: z.string().min(1).max(500),
  category: z.enum(['TRANSPORTATION', 'FUEL', 'STAFF', 'REPAIRS', 'MARKETING', 'UTILITIES', 'OTHER']),
  amount: z.number().positive(),
  date: z.string().min(1),
  reference: z.string().optional(),
});

type FormData = z.infer<typeof expenseSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Expense | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function ExpenseDrawer({ open, onClose, initialData, onSubmit, isSubmitting = false }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        description: initialData.description,
        category: initialData.category,
        amount: initialData.amount,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        reference: initialData.reference || '',
      });
    } else {
      reset({
        description: '',
        category: 'OTHER',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        reference: '',
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
                {initialData ? 'Edit Expense' : 'New Expense'}
              </h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description *</label>
                  <Input {...register('description')} error={errors.description?.message} placeholder="Expense description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category *</label>
                  <select
                    {...register('category')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  >
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="FUEL">Fuel</option>
                    <option value="STAFF">Staff</option>
                    <option value="REPAIRS">Repairs</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Amount *</label>
                  <Input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Date *</label>
                  <Input type="date" {...register('date')} />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Reference</label>
                  <Input {...register('reference')} placeholder="Invoice or PO number" />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')} Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}