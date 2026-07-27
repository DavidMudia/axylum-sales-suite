// src/components/purchase-orders/PurchaseOrderDrawer.tsx
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { PurchaseOrder } from '../../api/purchase-order';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useWarehouses } from '../../hooks/useWarehouses';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/currency';
import type { Warehouse } from '../../api/warehouse'; // ✅ added
import type { Product } from '../../api/product'; // ✅ added

// Zod schema – discount & tax are required (with default values provided in form)
const itemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitCost: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  tax: z.number().nonnegative(),
});

const purchaseOrderSchema = z.object({
  supplierId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  expectedDeliveryDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

type FormData = z.infer<typeof purchaseOrderSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: PurchaseOrder | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function PurchaseOrderDrawer({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const { data: suppliers } = useSuppliers();
  const { data: warehousesData } = useWarehouses();
  const { data: productsData } = useProducts();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      items: [{ productId: 0, quantity: 1, unitCost: 0, discount: 0, tax: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  // Calculate totals
  const totals = items.reduce(
    (acc, item) => {
      const total = (item.unitCost || 0) * (item.quantity || 0) - (item.discount || 0);
      const tax = total * ((item.tax || 0) / 100);
      const grandTotal = total + tax;
      return {
        subtotal: acc.subtotal + total,
        tax: acc.tax + tax,
        total: acc.total + grandTotal,
      };
    },
    { subtotal: 0, tax: 0, total: 0 }
  );

  useEffect(() => {
    if (initialData) {
      reset({
        supplierId: initialData.supplierId,
        warehouseId: initialData.warehouseId,
        expectedDeliveryDate: initialData.expectedDeliveryDate || '',
        notes: initialData.notes || '',
        items: initialData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          discount: item.discount || 0,
          tax: item.tax || 0,
        })),
      });
    } else {
      reset({
        items: [{ productId: 0, quantity: 1, unitCost: 0, discount: 0, tax: 0 }],
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-slate-900">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {initialData ? 'Edit Purchase Order' : 'New Purchase Order'}
              </h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Supplier *</label>
                  <select
                    {...register('supplierId', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  >
                    <option value="">Select supplier</option>
                    {suppliers?.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId.message}</p>}
                </div>

                {/* Warehouse */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Warehouse *</label>
                  <select
                    {...register('warehouseId', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  >
                    <option value="">Select warehouse</option>
                    {warehousesData?.data?.map((w: Warehouse) => ( // ✅ typed
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  {errors.warehouseId && <p className="mt-1 text-sm text-red-600">{errors.warehouseId.message}</p>}
                </div>

                {/* Expected Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Expected Delivery Date</label>
                  <Input type="date" {...register('expectedDeliveryDate')} />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Notes</label>
                  <textarea
                    {...register('notes')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                    rows={3}
                  />
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">Items</h3>
                    <Button
                      type="button"
                      variant="secondary"
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm"
                      onClick={() => append({ productId: 0, quantity: 1, unitCost: 0, discount: 0, tax: 0 })}
                    >
                      <Plus size={16} /> Add Item
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-12 gap-2 items-end border-b pb-2">
                        <div className="col-span-4">
                          <label className="text-xs text-slate-500">Product</label>
                          <select
                            {...register(`items.${index}.productId`, { valueAsNumber: true })}
                            className="mt-1 block w-full rounded border border-slate-300 px-2 py-1 text-sm"
                          >
                            <option value="">Select</option>
                            {productsData?.data?.map((p: Product) => ( // ✅ typed
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-slate-500">Qty</label>
                          <Input
                            type="number"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-slate-500">Unit Cost</label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="text-xs text-slate-500">Disc%</label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.discount`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="text-xs text-slate-500">Tax%</label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.tax`, { valueAsNumber: true })}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-3 text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>}
                </div>

                {/* Totals */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')} Purchase Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}