// src/components/refunds/RefundDrawer.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { usePayments } from '../../hooks/usePayments';

const refundSchema = z.object({
  paymentId: z.number().int().positive(),
  amount: z.number().positive(),
  reason: z.string().min(3).max(500),
  notes: z.string().optional(),
  refundMethod: z.enum(['CASH', 'TRANSFER', 'CARD', 'CHECK', 'OTHER']),
});

type FormData = z.infer<typeof refundSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  defaultPaymentId?: number;
};

export default function RefundDrawer({ open, onClose, onSubmit, isSubmitting = false, defaultPaymentId }: Props) {
  const { data: paymentsData } = usePayments(
  '',
  'COMPLETED',
  true
);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      refundMethod: 'TRANSFER',
    },
  });

  useEffect(() => {
    if (defaultPaymentId) {
      setValue('paymentId', defaultPaymentId);
    }
    if (!open) {
      reset({ refundMethod: 'TRANSFER' });
    }
  }, [defaultPaymentId, open, reset, setValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Request Refund</h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Payment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Payment *</label>
                  <p>Total payments: {paymentsData?.data?.length ?? 0}</p>
                  <select
                    {...register('paymentId', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  >
                    <option value="">Select payment</option>
                    {paymentsData?.data?.map((p) => (
  <option key={p.id} value={p.id}>
    {p.paymentNumber} - {p.customer.name} (₦{p.amount.toLocaleString()})
  </option>
))}
                  </select>
                  {errors.paymentId && <p className="mt-1 text-sm text-red-600">{errors.paymentId.message}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Refund Amount *</label>
                  <Input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Reason *</label>
                  <Input {...register('reason')} placeholder="Why is this refund needed?" />
                  {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                </div>

                {/* Refund Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Refund Method *</label>
                  <select {...register('refundMethod')} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm">
                    <option value="CASH">Cash</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="CARD">Card</option>
                    <option value="CHECK">Check</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.refundMethod && <p className="mt-1 text-sm text-red-600">{errors.refundMethod.message}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Notes</label>
                  <textarea {...register('notes')} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" rows={3} />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Request Refund'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}