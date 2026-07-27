import { useParams, Navigate, Link } from 'react-router-dom';
import {
  usePayment,
  useApprovePayment,
  useCancelPayment,
} from '../hooks/usePayments';
import PageHeader from '../components/ui/PageHeader';
import { formatCurrency } from '../utils/currency';
import Button from '../components/ui/Button';
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';

export default function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const paymentId = Number(id);

  if (!paymentId || isNaN(paymentId)) {
    return <Navigate to="/payments" replace />;
  }

  const { data: payment, isLoading } = usePayment(paymentId);

  const approveMutation = useApprovePayment();
  const cancelMutation = useCancelPayment();

  const handleApprove = async () => {
    if (!confirm('Approve this payment?')) return;
    await approveMutation.mutateAsync(paymentId);
  };

  const handleCancel = async () => {
    const reason = prompt('Reason for cancelling this payment?');

    if (reason === null) return;

    await cancelMutation.mutateAsync({
      id: paymentId,
      reason,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
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
    CANCELLED: 'bg-slate-200 text-slate-700',
  };

  const invoiceStatusColors = {
    UNPAID: 'bg-red-100 text-red-700',
    PARTIAL: 'bg-amber-100 text-amber-700',
    PAID: 'bg-emerald-100 text-emerald-700',
  };

  const progress =
    payment.invoice.total > 0
      ? Math.min(
          (payment.invoice.amountPaid / payment.invoice.total) * 100,
          100
        )
      : 0;

  const isPending = payment.status === 'PENDING';

  return (
    <div className="space-y-8 text-slate-900">

      <div className="flex items-center justify-between">

        <PageHeader
          title={`Payment ${payment.paymentNumber}`}
          subtitle={`Invoice ${payment.invoice.invoiceNumber}`}
        />

        <div className="flex gap-3">

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              statusColors[payment.status]
            }`}
          >
            {payment.status}
          </span>

          {isPending && (
            <>
              <Button
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle size={18} className="mr-2" />
                Approve
              </Button>

              <Button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle size={18} className="mr-2" />
                Cancel
              </Button>
            </>
          )}

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Payment */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 font-semibold text-slate-800">
            Payment Details
          </h3>

          <dl className="space-y-3">

            <div className="flex justify-between">
              <dt>Payment Number</dt>
              <dd>{payment.paymentNumber}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Customer</dt>
              <dd>{payment.customer.name}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Amount</dt>
              <dd className="font-bold">
                {formatCurrency(payment.amount)}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt>Method</dt>
              <dd>{payment.paymentMethod}</dd>
            </div>

            {payment.transactionId && (
              <div className="flex justify-between">
                <dt>Transaction ID</dt>
                <dd>{payment.transactionId}</dd>
              </div>
            )}

          </dl>

        </div>

        {/* Invoice Summary */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 font-semibold text-slate-800">
            Invoice Summary
          </h3>

          <dl className="space-y-3">

            <div className="flex justify-between">

              <dt>Invoice</dt>

              <dd>
                <Link
                  to={`/invoices/${payment.invoiceId}`}
                  className="text-indigo-600 hover:underline"
                >
                  {payment.invoice.invoiceNumber}
                </Link>
              </dd>

            </div>

            <div className="flex justify-between">
              <dt>Total</dt>
              <dd>{formatCurrency(payment.invoice.total)}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Paid</dt>
              <dd className="text-emerald-700 font-semibold">
                {formatCurrency(payment.invoice.amountPaid)}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt>Outstanding</dt>
              <dd className="text-red-600 font-semibold">
                {formatCurrency(payment.invoice.balance)}
              </dd>
            </div>

            <div className="flex justify-between">

              <dt>Status</dt>

              <dd
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  invoiceStatusColors[payment.invoice.paymentStatus]
                }`}
              >
                {payment.invoice.paymentStatus}
              </dd>

            </div>

          </dl>

          <div className="mt-6">

            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Payment Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {payment.invoice.balance > 0 && (
            <div className="mt-6">

              <Link
                to={`/payments/new?invoice=${payment.invoiceId}`}
              >
                <Button className="w-full">
                  <CreditCard size={18} className="mr-2" />
                  Record Remaining Balance
                </Button>
              </Link>

            </div>
          )}

        </div>

        {/* Timeline */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 font-semibold text-slate-800">
            Timeline
          </h3>

          <dl className="space-y-3">

            <div className="flex justify-between">
              <dt>Created</dt>
              <dd>{new Date(payment.createdAt).toLocaleString()}</dd>
            </div>

            {payment.approvedAt && (
              <div className="flex justify-between">
                <dt>Approved</dt>
                <dd>{new Date(payment.approvedAt).toLocaleString()}</dd>
              </div>
            )}

            {payment.cancelledAt && (
              <div className="flex justify-between">
                <dt>Cancelled</dt>
                <dd>{new Date(payment.cancelledAt).toLocaleString()}</dd>
              </div>
            )}

            {payment.notes && (
              <div>
                <dt className="mb-2">Notes</dt>
                <dd className="rounded-lg bg-slate-50 p-3">
                  {payment.notes}
                </dd>
              </div>
            )}

          </dl>

        </div>

      </div>

      <div>

        <Link
          to="/payments"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Payments
        </Link>

      </div>

    </div>
  );
}