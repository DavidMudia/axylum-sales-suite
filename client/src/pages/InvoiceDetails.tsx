// src/pages/InvoiceDetails.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvoice, useApproveInvoice, useMarkInvoicePrinted } from '../hooks/useInvoices';
import { useCreatePayment } from '../hooks/usePayments';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import { formatCurrency } from '../utils/currency';
import Button from '../components/ui/Button';
import PaymentDrawer from '../components/payments/PaymentDrawer';
import { Printer, CheckCircle, CreditCard } from 'lucide-react';

export default function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const invoiceId = Number(id);

  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const approveMutation = useApproveInvoice();
  const printMutation = useMarkInvoicePrinted();
  const createPaymentMutation = useCreatePayment();

  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);

  const handleApprove = async () => {
    const note = prompt('Approval note (optional):');
    if (note === null) return;
    await approveMutation.mutateAsync({ id: invoiceId, note: note || undefined });
  };

  const handlePrint = async () => {
    try {
      await printMutation.mutateAsync(invoiceId);
      window.print();
    } catch (error) {
      alert('Failed to mark invoice as printed.');
    }
  };

  const handleRecordPayment = () => {
    setPaymentDrawerOpen(true);
  };

  const handlePaymentSubmit = async (data: any) => {
    await createPaymentMutation.mutateAsync(data);
    setPaymentDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!invoice) {
    return <div className="rounded-2xl border bg-white p-12 text-center">Invoice not found.</div>;
  }

  const canApprove = invoice.status === 'UNPAID' && !invoice.isApproved;

  return (
    <div className="space-y-8 text-slate-900 text-lg">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Invoice #${invoice.invoiceNumber}`}
          subtitle={`Customer: ${invoice.customer.name}`}
        />
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(invoice.status)}`}>
            {invoice.status}
          </span>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            invoice.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
            invoice.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {invoice.paymentStatus}
          </span>

          {invoice.balance > 0 && (
            <Button onClick={handleRecordPayment} className="bg-indigo-600 hover:bg-indigo-700">
              <CreditCard size={18} className="mr-2" /> Record Payment
            </Button>
          )}

          {!invoice.isPrinted && (
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer size={18} className="mr-2" /> Print
            </Button>
          )}
          {canApprove && (
            <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle size={18} className="mr-2" /> Approve
            </Button>
          )}
          {invoice.isApproved && !invoice.isPrinted && (
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer size={18} className="mr-2" /> Print
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 text-lg">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Invoice Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Customer</dt>
              <dd className="font-medium">{invoice.customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Due Date</dt>
              <dd className="font-medium">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</dd>
            </div>
            {invoice.isApproved && invoice.approvedAt && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Approved At</dt>
                <dd className="font-medium">{new Date(invoice.approvedAt).toLocaleDateString()}</dd>
              </div>
            )}
            {invoice.salesOrder && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Source Order</dt>
                <dd className="font-medium">
                  <Link to={`/orders/${invoice.salesOrder.id}`} className="text-indigo-600 hover:underline">
                    {invoice.salesOrder.orderNumber}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Financial Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Fee</span>
              <span>{formatCurrency(invoice.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Labour Fee</span>
              <span>{formatCurrency(invoice.labourFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <span>-{formatCurrency(invoice.discount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid</span>
              <span>{formatCurrency(invoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between font-bold text-red-600">
              <span>Balance</span>
              <span>{formatCurrency(invoice.balance)}</span>
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
              {invoice.items.map((item) => (
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

      {/* Payments & Waybills */}
      <div className="grid gap-6 md:grid-cols-2">
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500">Payments</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {invoice.payments.map((payment) => (
                <li key={payment.id} className="flex justify-between">
                  {/* ✅ Only render link if payment.id exists */}
                  {payment.id ? (
                    <Link to={`/payments/${payment.id}`} className="text-indigo-600 hover:underline">
                      {payment.paymentNumber}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{payment.paymentNumber}</span>
                  )}
                  <span>{formatCurrency(payment.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {invoice.waybills && invoice.waybills.length > 0 && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500">Waybills</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {invoice.waybills.map((waybill) => (
                <li key={waybill.id} className="flex justify-between">
                  <Link to={`/waybills/${waybill.id}`} className="text-indigo-600 hover:underline">
                    {waybill.waybillNumber}
                  </Link>
                  <span>{waybill.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Payment Drawer */}
      <PaymentDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        initialData={null}
        onSubmit={handlePaymentSubmit}
        isSubmitting={createPaymentMutation.isPending}
        defaultInvoiceId={invoiceId}
      />
    </div>
  );
}