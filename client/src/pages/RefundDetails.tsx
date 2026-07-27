// src/pages/PaymentDetails.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePayment, useApprovePayment, useCancelPayment } from '../hooks/usePayments';
import { useCreateRefund } from '../hooks/useRefunds';
import PageHeader from '../components/ui/PageHeader';
import { formatCurrency } from '../utils/currency';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import RefundDrawer from '../components/refunds/RefundDrawer';

export default function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const paymentId = Number(id);

  const { data: payment, isLoading } = usePayment(paymentId);
  const approveMutation = useApprovePayment();
  const cancelMutation = useCancelPayment();
  const createRefundMutation = useCreateRefund();

  const [refundDrawerOpen, setRefundDrawerOpen] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Approve this payment?')) return;
    await approveMutation.mutateAsync(paymentId);
  };

  const handleCancel = async () => {
  const reason = prompt("Cancellation reason:");

  if (reason === null) return;

  await cancelMutation.mutateAsync({
    id: paymentId,
    reason,
  });
};

  const handleRefundSubmit = async (data: any) => {
    await createRefundMutation.mutateAsync(data);
    setRefundDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        Payment not found.
      </div>
    );
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    FAILED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-gray-100 text-gray-700',
  };

  const isPending = payment.status === 'PENDING';
  const remainingRefundable = payment.status === 'COMPLETED' ? payment.amount - (payment.refundedAmount || 0) : 0;
  const canRequestRefund = payment.status === 'COMPLETED' && remainingRefundable > 0;

  return (
    <div className="space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Payment #${payment.paymentNumber}`}
          subtitle={`Invoice: ${payment.invoice?.invoiceNumber || `#${payment.invoiceId}`}`}
        />
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColors[payment.status]}`}>
            {payment.status}
          </span>
          {isPending && (
            <>
              <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle size={18} className="mr-2" /> Approve
              </Button>
              <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                <XCircle size={18} className="mr-2" /> Cancel
              </Button>
            </>
          )}
          {canRequestRefund && (
            <Button onClick={() => setRefundDrawerOpen(true)} className="bg-amber-600 hover:bg-amber-700">
              Request Refund
            </Button>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Payment Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Payment Number</dt>
              <dd className="font-medium">{payment.paymentNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Invoice</dt>
              <dd className="font-medium">
                <Link to={`/invoices/${payment.invoiceId}`} className="text-indigo-600 hover:underline">
                  {payment.invoice?.invoiceNumber || `#${payment.invoiceId}`}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Customer</dt>
              <dd className="font-medium">{payment.customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Amount</dt>
              <dd className="font-bold text-lg">{formatCurrency(payment.amount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Refunded Amount</dt>
              <dd className="font-medium">{formatCurrency(payment.refundedAmount || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Remaining Refundable</dt>
              <dd className="font-medium">{formatCurrency(remainingRefundable)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Payment Method</dt>
              <dd className="font-medium">{payment.paymentMethod}</dd>
            </div>
            {payment.transactionId && (
  <div className="flex justify-between">
    <dt className="text-slate-500">Transaction ID</dt>
    <dd className="font-medium">{payment.transactionId}</dd>
  </div>
)}
          </dl>
        </div>

        {/* Right Column */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Timeline</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(payment.createdAt).toLocaleString()}</dd>
            </div>
            {payment.approvedAt && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Processed</dt>
                <dd className="font-medium">{new Date(payment.approvedAt).toLocaleString()}</dd>
              </div>
            )}
            {payment.notes && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Notes</dt>
                <dd className="font-medium">{payment.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link to="/payments" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Back to Payments
        </Link>
      </div>

      {/* Refund Drawer */}
      <RefundDrawer
        open={refundDrawerOpen}
        onClose={() => setRefundDrawerOpen(false)}
        onSubmit={handleRefundSubmit}
        isSubmitting={createRefundMutation.isPending}
        defaultPaymentId={paymentId}
      />
    </div>
  );
}