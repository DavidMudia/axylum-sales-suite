// src/pages/PurchaseOrderDetails.tsx
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePurchaseOrder, useApprovePurchaseOrder, useCancelPurchaseOrder } from '../hooks/usePurchaseOrders';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import { formatCurrency } from '../utils/currency';
import { PURCHASE_ORDERS_QUERY_KEY } from '../hooks/usePurchaseOrders';

export default function PurchaseOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const queryClient = useQueryClient();

  const { data: order, isLoading } = usePurchaseOrder(orderId);
  const approveMutation = useApprovePurchaseOrder();
  const cancelMutation = useCancelPurchaseOrder();

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this purchase order?')) return;
    try {
      await approveMutation.mutateAsync(orderId);
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY, orderId] });
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
    } catch (error) {
      alert('Failed to approve purchase order.');
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Please provide a cancellation reason:');
    if (reason === null) return; // user cancelled
    if (!reason.trim()) {
      alert('Cancellation reason is required.');
      return;
    }
    if (!confirm('Are you sure you want to cancel this purchase order?')) return;
    try {
      await cancelMutation.mutateAsync({ id: orderId, reason: reason.trim() });
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY, orderId] });
      queryClient.invalidateQueries({ queryKey: [PURCHASE_ORDERS_QUERY_KEY] });
    } catch (error) {
      alert('Failed to cancel purchase order.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        Purchase order not found.
      </div>
    );
  }

  const canApprove = order.status === 'DRAFT' || order.status === 'PENDING_APPROVAL';
  const canCancel = order.status !== 'CANCELLED' && order.status !== 'RECEIVED';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`PO #${order.purchaseOrderNumber}`}
          subtitle={`Supplier: ${order.supplier.name}`}
        />
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>

          {canApprove && (
            <button
              onClick={handleApprove}
              disabled={approveMutation.isPending}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {approveMutation.isPending ? 'Approving...' : 'Approve'}
            </button>
          )}

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 text-slate-800">
        {/* Order Details */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
          <h3 className="text-sm font-semibold text-slate-500">Order Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Supplier</dt>
              <dd className="font-medium">{order.supplier.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Warehouse</dt>
              <dd className="font-medium">{order.warehouse.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Expected Delivery</dt>
              <dd className="font-medium">
                {order.expectedDeliveryDate
                  ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between text-slate-800">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Notes</dt>
              <dd className="font-medium">{order.notes || '—'}</dd>
            </div>
          </dl>
        </div>

        {/* Financial Summary */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
          <h3 className="text-sm font-semibold text-slate-500">Financial Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <span>{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
        <h3 className="text-sm font-semibold text-slate-500">Items</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">
                  Qty
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">
                  Unit Cost
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">
                  Discount
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">
                  Tax
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{item.product.name}</td>
                  <td className="px-4 py-2 text-sm">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm">{formatCurrency(item.unitCost)}</td>
                  <td className="px-4 py-2 text-sm">{formatCurrency(item.discount)}</td>
                  <td className="px-4 py-2 text-sm">{item.tax}%</td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked Goods Receipts */}
      {order.goodsReceipts && order.goodsReceipts.length > 0 && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-800">
          <h3 className="text-sm font-semibold text-slate-500">Linked Goods Receipts</h3>
          <ul className="mt-4 space-y-2">
            {order.goodsReceipts.map((gr) => (
              <li key={gr.id}>
                <Link
                  to={`/goods-receipts/${gr.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  {gr.receiptNumber}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}