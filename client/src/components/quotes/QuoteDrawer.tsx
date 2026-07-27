// src/components/quotes/QuoteDrawer.tsx
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Quote } from '../../api/quote';
import { useCustomers } from '../../hooks/useCustomers';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/currency';

const itemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  remarks: z.string().optional(),
});

const quoteSchema = z.object({
  customerId: z.number().int().positive(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required.'),
});

type FormData = z.infer<typeof quoteSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Quote | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function QuoteDrawer({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const { data: customers } = useCustomers();
  const { data: productsData } = useProducts();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue, // ✅ added for auto-fill
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      items: [{ productId: 0, quantity: 1, unitPrice: 0, discount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  // Calculate totals (no tax)
  const totals = items.reduce(
    (acc, item) => {
      const total = (item.unitPrice || 0) * (item.quantity || 0) - (item.discount || 0);
      return {
        subtotal: acc.subtotal + total,
        total: acc.total + total,
      };
    },
    { subtotal: 0, total: 0 }
  );

  useEffect(() => {
    if (initialData) {
      reset({
        customerId: initialData.customerId,
        validUntil: initialData.validUntil || '',
        notes: initialData.notes || '',
        items: initialData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          remarks: item.remarks || '',
        })),
      });
    } else {
      reset({
        items: [{ productId: 0, quantity: 1, unitPrice: 0, discount: 0 }],
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900 text-lg">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {initialData ? 'Edit Quote' : 'New Quote'}
              </h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 text-lg">
              <div className="space-y-6">
                {/* Customer */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">Customer *</label>
                  <select
                    {...register('customerId', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-lg"
                  >
                    <option value="">Select customer</option>
                    {customers?.data?.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.customerId && <p className="mt-1 text-lg text-red-600">{errors.customerId.message}</p>}
                </div>

                {/* Valid Until */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">Valid Until</label>
                  <Input type="date" {...register('validUntil')} />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-lg font-medium text-slate-700">Notes</label>
                  <textarea {...register('notes')} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-lg" rows={3} />
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-700">Items</h3>
                    <Button
                      type="button"
                      variant="secondary"
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm"
                      onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0, discount: 0 })}
                    >
                      <Plus size={16} /> Add Item
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-2 text-lg">
                        <div className="col-span-4">
                          <label className="text-lg text-slate-500">Product</label>
                          <select
                            {...register(`items.${index}.productId`, { valueAsNumber: true })}
                            className="mt-1 block w-full rounded border border-slate-300 px-2 py-1 text-lg"
                            onChange={(e) => {
                              const p = productsData?.data?.find(
                                (x: any) => x.id === Number(e.target.value)
                              );
                              if (p) {
                                setValue(
                                  `items.${index}.unitPrice`,
                                  p.sellingPrice || p.unitPrice || 0
                                );
                              }
                            }}
                          >
                            <option value="">Select</option>
                            {productsData?.data?.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-lg text-slate-500">Qty</label>
                          <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-lg text-slate-500">Unit Price</label>
                          <Input type="number" step="0.01" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-lg text-slate-500">Discount</label>
                          <Input type="number" step="0.01" {...register(`items.${index}.discount`, { valueAsNumber: true })} className="mt-1" placeholder="0" />
                        </div>
                        <div className="col-span-1">
                          <button type="button" onClick={() => remove(index)} className="mt-3 text-red-500 hover:text-red-700 text-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.items && <p className="mt-1 text-lg text-red-600">{errors.items.message}</p>}
                </div>

                {/* Totals */}
                <div className="rounded-lg bg-slate-50 p-4 text-slate-900">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6 text-lg">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')} Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}