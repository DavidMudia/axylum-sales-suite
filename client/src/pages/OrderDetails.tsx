// src/pages/OrderDetails.tsx

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder, useApproveOrder, useCancelOrder } from '../hooks/useOrders';
import { useConvertSalesOrderToInvoice } from '../hooks/useInvoices';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import Button from '../components/ui/Button';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading } = useOrder(orderId);

  const approveMutation = useApproveOrder();
  const cancelMutation = useCancelOrder();
  const convertMutation = useConvertSalesOrderToInvoice();

  const handleApprove = async () => {
    if (!confirm('Approve this order?')) return;
    await approveMutation.mutateAsync(orderId);
  };

  const handleCancel = async () => {
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;

    await cancelMutation.mutateAsync({
      id: orderId,
      reason: reason || 'No reason provided',
    });
  };

  const handleGenerateInvoice = async () => {
    if (!confirm('Generate invoice from this sales order?')) return;

    try {
      const invoice = await convertMutation.mutateAsync(orderId);

      alert(`Invoice ${invoice.invoiceNumber} generated successfully.`);

      navigate(`/invoices/${invoice.id}`);
    } catch {
      alert(
        'Failed to generate invoice. This order may already have an invoice.'
      );
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
        Order not found.
      </div>
    );
  }

  const canApproveCancel =
    order.status !== 'DELIVERED' &&
    order.status !== 'CANCELLED';

  const canGenerateInvoice =
    (order.status === 'APPROVED' ||
      order.status === 'DELIVERED') &&
    !order.invoice;

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Order #${order.orderNumber}`}
          subtitle={`Customer: ${order.customer.name}`}
        />

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>

          {canApproveCancel && (
            <>
              <Button
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve
              </Button>

              <Button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel
              </Button>
            </>
          )}

          {/* View Invoice */}
          {order.invoice && (
            <Link to={`/invoices/${order.invoice.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Invoice
              </Button>
            </Link>
          )}

          {/* Generate Invoice */}
          {canGenerateInvoice && (
            <Button
              onClick={handleGenerateInvoice}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Keep the rest of your existing component exactly as it was */}
      </div>
    </div>
  );
}