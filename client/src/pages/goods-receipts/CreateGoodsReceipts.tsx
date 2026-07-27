// src/pages/goods-receipts/CreateGoodsReceipts.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';
import { useApprovedPurchaseOrders } from '../../hooks/usePurchaseOrders';
import { createGoodsReceipt } from '../../api/goodsReceipt';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { formatCurrency } from '../../utils/currency';
import type { PurchaseOrder, PurchaseOrderItem } from '../../api/purchase-order';

// Schema for the receipt form
const receiptItemSchema = z.object({
  purchaseOrderItemId: z.number().int().positive(),
  productId: z.number().int().positive(),
  productName: z.string(),
  orderedQuantity: z.number().positive(),
  unitCost: z.number().nonnegative(),
  receivedQuantity: z.number().min(0),
  rejectedQuantity: z.number().min(0),
  remarks: z.string().optional(),
});

const receiptSchema = z.object({
  purchaseOrderId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  supplierId: z.number().int().positive(),
  supplierName: z.string(),
  supplierInvoiceNumber: z.string().optional(),
  supplierDeliveryNote: z.string().optional(),
  truckNumber: z.string().optional(),
  driverName: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(receiptItemSchema).min(1),
});

type FormData = z.infer<typeof receiptSchema>;

export default function CreateGoodsReceipts() {
  const navigate = useNavigate();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: approvedPOs, isLoading: loadingPOs } = useApprovedPurchaseOrders();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  // Calculate totals for display
  const totals = items.reduce(
    (acc, item) => {
      const received = item?.receivedQuantity || 0;
      const rejected = item?.rejectedQuantity || 0;
      const total = (item?.unitCost || 0) * (received + rejected);
      return {
        totalReceived: acc.totalReceived + received,
        totalRejected: acc.totalRejected + rejected,
        totalValue: acc.totalValue + total,
      };
    },
    { totalReceived: 0, totalRejected: 0, totalValue: 0 }
  );

  // Select a PO
  const handleSelectPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    // Pre-fill the form with PO data
    reset({
      purchaseOrderId: po.id,
      warehouseId: po.warehouseId,
      supplierId: po.supplierId,
      supplierName: po.supplier.name,
      supplierInvoiceNumber: '',
      supplierDeliveryNote: '',
      truckNumber: '',
      driverName: '',
      remarks: '',
      items: po.items.map((item: PurchaseOrderItem) => ({
        purchaseOrderItemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        orderedQuantity: item.quantity,
        unitCost: item.unitCost,
        receivedQuantity: item.quantity, // Default to full quantity
        rejectedQuantity: 0,
        remarks: '',
      })),
    });
    setStep('form');
  };

  // Go back to PO selection
  const handleBack = () => {
    setStep('select');
    setSelectedPO(null);
  };

  // Submit the receipt
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Filter items where receivedQuantity > 0 or rejectedQuantity > 0
      const itemsToSubmit = data.items
        .filter((item) => (item.receivedQuantity || 0) > 0 || (item.rejectedQuantity || 0) > 0)
        .map((item) => ({
          purchaseOrderItemId: item.purchaseOrderItemId,
          receivedQuantity: item.receivedQuantity || 0,
          rejectedQuantity: item.rejectedQuantity || 0,
          remarks: item.remarks,
        }));

      if (itemsToSubmit.length === 0) {
        alert('Please enter at least one item with received or rejected quantity.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        purchaseOrderId: data.purchaseOrderId,
        warehouseId: data.warehouseId,
        supplierInvoiceNumber: data.supplierInvoiceNumber,
        supplierDeliveryNote: data.supplierDeliveryNote,
        truckNumber: data.truckNumber,
        driverName: data.driverName,
        remarks: data.remarks,
        items: itemsToSubmit,
      };

      await createGoodsReceipt(payload);
      navigate('/goods-receipts');
    } catch (error) {
      console.error('Failed to create goods receipt:', error);
      alert('Failed to create goods receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Select PO
  if (step === 'select') {
    return (
      <div className="space-y-8 text-slate-800">
        <PageHeader
          title="Receive Goods"
          subtitle="Select an approved purchase order to receive"
        />

        {loadingPOs ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          </div>
        ) : approvedPOs && approvedPOs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {approvedPOs.map((po) => (
              <button
                key={po.id}
                onClick={() => handleSelectPO(po)}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-indigo-600">{po.purchaseOrderNumber}</h3>
                    <p className="text-sm text-slate-600">{po.supplier.name}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {po.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Total:</span>
                    <span className="ml-2 font-medium">{formatCurrency(po.total)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Items:</span>
                    <span className="ml-2 font-medium">{po.items.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Warehouse:</span>
                    <span className="ml-2 font-medium">{po.warehouse.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Created:</span>
                    <span className="ml-2 font-medium">{new Date(po.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-12 text-center text-slate-800">
            <Package className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No Approved Purchase Orders</h3>
            <p className="mt-2 text-sm text-slate-500">
              There are no approved purchase orders available for receiving.
              Please approve a purchase order first.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Receipt Form
  return (
    <div className="space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          title="Receive Goods"
          subtitle={`Receiving PO: ${selectedPO?.purchaseOrderNumber} from ${selectedPO?.supplier.name}`}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* PO Summary Card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Purchase Order</p>
                <p className="font-semibold">{selectedPO?.purchaseOrderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Supplier</p>
                <p className="font-semibold">{selectedPO?.supplier.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Warehouse</p>
                <p className="font-semibold">{selectedPO?.warehouse.name}</p>
              </div>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Receipt Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Supplier Invoice Number</label>
                <Input {...register('supplierInvoiceNumber')} placeholder="INV-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Supplier Delivery Note</label>
                <Input {...register('supplierDeliveryNote')} placeholder="DN-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Truck Number</label>
                <Input {...register('truckNumber')} placeholder="Truck #" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Driver Name</label>
                <Input {...register('driverName')} placeholder="Driver name" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Remarks</label>
                <textarea
                  {...register('remarks')}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  rows={2}
                  placeholder="Additional notes"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Items</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">Received: <strong>{totals.totalReceived}</strong></span>
                <span className="text-slate-500">Rejected: <strong>{totals.totalRejected}</strong></span>
                <span className="text-slate-500">Total Value: <strong>{formatCurrency(totals.totalValue)}</strong></span>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto text-slate-800">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">PO Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Received</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Rejected</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Unit Cost</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {fields.map((field, index) => {
                    const item = items[index];
                    const total = ((item?.receivedQuantity || 0) + (item?.rejectedQuantity || 0)) * (item?.unitCost || 0);
                    return (
                      <tr key={field.id}>
                        <td className="px-4 py-2 text-sm">{item?.productName}</td>
                        <td className="px-4 py-2 text-sm text-center">{item?.orderedQuantity}</td>
                        <td className="px-4 py-2">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.receivedQuantity`, { valueAsNumber: true })}
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.rejectedQuantity`, { valueAsNumber: true })}
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-center">{formatCurrency(item?.unitCost || 0)}</td>
                        <td className="px-4 py-2 text-sm font-medium text-center">{formatCurrency(total)}</td>
                        <td className="px-4 py-2">
                          <Input
                            {...register(`items.${index}.remarks`)}
                            className="w-32 text-sm"
                            placeholder="Optional"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {errors.items && <p className="mt-2 text-sm text-red-600">{errors.items.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 text-slate-800">
            <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : (
                <>
                  <CheckCircle size={18} className="mr-2 inline" />
                  Create Receipt
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}