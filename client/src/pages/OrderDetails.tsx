// src/pages/OrderDetails.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder, useApproveOrder, useCancelOrder } from '../hooks/useOrders';
import { useConvertSalesOrderToInvoice } from '../hooks/useInvoices';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import { formatCurrency } from '../utils/currency';
import Button from '../components/ui/Button';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading } = useOrder(orderId);
  const approveMutation = useApproveOrder();
  const cancelMutation = useCancelOrder();
  const convertMutation = useConvertSalesOrderToInvoice();

  // Debug logs to help diagnose
  console.log('🔍 Order details:', order);
  console.log('🔍 Invoice relation:', order?.invoice);

  const handleApprove = async () => {
    if (!confirm('Approve this order?')) return;
    await approveMutation.mutateAsync(orderId);
  };

  const handleCancel = async () => {
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;
    await cancelMutation.mutateAsync({ id: orderId, reason: reason || 'No reason provided' });
  };

  const handleGenerateInvoice = async () => {
    if (!confirm('Generate invoice from this sales order?')) return;
    try {
      const invoice = await convertMutation.mutateAsync(orderId);
      alert(`Invoice ${invoice.invoiceNumber} generated successfully.`);
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      alert('Failed to generate invoice. This order may already have an invoice.');
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
    return <div className="rounded-2xl border bg-white p-12 text-center">Order not found.</div>;
  }

  const canApproveCancel = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
  const hasInvoice = !!order.invoice;
  // ✅ Allow generating invoice from APPROVED or DELIVERED status (if no invoice yet)
  const canGenerateInvoice = (order.status === 'APPROVED' || order.status === 'DELIVERED') && !order.invoice;

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Order #${order.orderNumber}`}
          subtitle={`Customer: ${order.customer.name}`}
        />
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(order.status)}`}>
            {order.status}
          </span>
          {canApproveCancel && (
            <>
              <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
                Approve
              </Button>
              <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                Cancel
              </Button>
            </>
          )}
          {hasInvoice && (
            <Link to={`/invoices/${order.invoice.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Invoice
              </Button>
            </Link>
          )}
          {canGenerateInvoice && (
            <Button onClick={handleGenerateInvoice} className="bg-indigo-600 hover:bg-indigo-700">
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Order Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Customer</dt>
              <dd className="font-medium">{order.customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Delivery Address</dt>
              <dd className="font-medium">{order.deliveryAddress || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Expected Delivery</dt>
              <dd className="font-medium">{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</dd>
            </div>
            {order.approvedAt && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Approved At</dt>
                <dd className="font-medium">{new Date(order.approvedAt).toLocaleDateString()}</dd>
              </div>
            )}
            {order.cancelledAt && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Cancelled At</dt>
                <dd className="font-medium">{new Date(order.cancelledAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Financial Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Fee</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Labour Fee</span>
              <span>{formatCurrency(order.labourFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <span>{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500">Items</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Qty</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Unit Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{item.product.name}</td>
                  <td className="px-4 py-2 text-sm">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-2 text-sm font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}