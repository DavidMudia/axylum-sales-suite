// src/components/payments/PaymentDrawer.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Payment } from '../../api/payment';
import { useInvoices } from '../../hooks/useInvoices';

const paymentSchema = z.object({
  invoiceId: z.number().int().positive(),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    'CASH',
    'TRANSFER',
    'CHEQUE',
    'CARD',
    'OTHER',
  ]),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof paymentSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Payment | null;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
  defaultInvoiceId?: number;
};

export default function PaymentDrawer({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
  defaultInvoiceId,
}: Props) {
  const { data: invoicesData, isLoading } = useInvoices();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'CASH',
    },
  });

  useEffect(() => {
    if (defaultInvoiceId) {
      setValue('invoiceId', defaultInvoiceId);
    }
  }, [defaultInvoiceId, setValue]);

  useEffect(() => {
    if (initialData) {
      reset({
        invoiceId: initialData.invoiceId,
        amount: initialData.amount,
        paymentMethod: initialData.paymentMethod,
        transactionId: initialData.transactionId ?? '',
        notes: initialData.notes ?? '',
      });
    } else {
      reset({
        invoiceId: defaultInvoiceId,
        paymentMethod: 'CASH',
        amount: 0,
        transactionId: '',
        notes: '',
      });
    }
  }, [initialData, defaultInvoiceId, reset]);

  if (!open) return null;

  const invoices = Array.isArray(invoicesData)
    ? invoicesData
    : invoicesData?.data ?? [];

  // Show every invoice that still has money owing
  const outstandingInvoices = invoices.filter(
    (inv) => Number(inv.balance ?? 0) > 0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900 text-lg">
      <div
        className="fixed inset-0 bg-black/40 text-lg"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold">
                {initialData ? 'Edit Payment' : 'Record Payment'}
              </h2>

              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="space-y-4">

                {/* Invoice */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">
                    Invoice *
                  </label>

                  {isLoading ? (
                    <p className="mt-1 text-lg text-slate-500">
                      Loading invoices...
                    </p>
                  ) : outstandingInvoices.length === 0 ? (
                    <p className="mt-1 text-lg text-amber-600">
                      No invoices with outstanding balances.
                    </p>
                  ) : (
                    <select
                      {...register('invoiceId', {
                        valueAsNumber: true,
                      })}
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-lg"
                    >
                      <option value="">
                        Select invoice
                      </option>

                      {outstandingInvoices.map((inv) => (
                        <option
                          key={inv.id}
                          value={inv.id}
                        >
                          {inv.invoiceNumber} — {inv.customer.name}
                          {' • '}
                          Balance:
                          {' '}
                          ₦{Number(inv.balance).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  )}

                  {errors.invoiceId && (
                    <p className="mt-1 text-lg text-red-600">
                      {errors.invoiceId.message}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">
                    Amount *
                  </label>

                  <Input
                    type="number"
                    step="0.01"
                    {...register('amount', {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.amount && (
                    <p className="mt-1 text-lg text-red-600">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">
                    Payment Method *
                  </label>

                  <select
                    {...register('paymentMethod')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-lg"
                  >
                    <option value="CASH">Cash</option>
                    <option value="TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>

                  {errors.paymentMethod && (
                    <p className="mt-1 text-lg text-red-600">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">
                    Transaction ID
                  </label>

                  <Input
                    {...register('transactionId')}
                    placeholder="Transfer reference (optional)"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">
                    Notes
                  </label>

                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-lg"
                  />
                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6 text-lg">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : initialData
                    ? 'Update Payment'
                    : 'Record Payment'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}