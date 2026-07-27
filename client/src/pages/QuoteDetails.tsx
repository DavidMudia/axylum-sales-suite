// src/pages/QuoteDetails.tsx
import { useParams, useNavigate } from 'react-router-dom'; // ✅ added useNavigate
import { useQuote, useApproveQuote, useRejectQuote } from '../hooks/useQuotes';
import { useConvertQuoteToOrder } from '../hooks/useOrders';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import { formatCurrency } from '../utils/currency';
import Button from '../components/ui/Button';

export default function QuoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // ✅ added
  const quoteId = Number(id);

  const { data: quote, isLoading } = useQuote(quoteId);
  const approveMutation = useApproveQuote();
  const rejectMutation = useRejectQuote();
  const convertMutation = useConvertQuoteToOrder();

  const handleApprove = async () => {
    if (!confirm('Approve this quote?')) return;
    await approveMutation.mutateAsync(quoteId);
  };

  const handleReject = async () => {
    const note = prompt('Rejection reason:');
    if (note === null) return;
    await rejectMutation.mutateAsync({ id: quoteId, note: note || 'No reason provided' });
  };

  const handleConvertToOrder = async () => {
    if (!confirm('Convert this quote to a sales order?')) return;
    try {
      const order = await convertMutation.mutateAsync(quoteId);
      alert(`Sales order ${order.orderNumber} created.`);
      navigate(`/orders/${order.id}`);
    } catch (error) {
      alert('Failed to convert. Only accepted quotes can be converted.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!quote) {
    return <div className="rounded-2xl border bg-white p-12 text-center">Quote not found.</div>;
  }

  const canApproveReject = quote.status === 'DRAFT' || quote.status === 'SENT';
  const canConvert = quote.status === 'ACCEPTED';

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Quote #${quote.quoteNumber}`}
          subtitle={`Customer: ${quote.customer.name}`}
        />
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(quote.status)}`}>
            {quote.status}
          </span>
          {canApproveReject && (
            <>
              <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
                Approve
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                Reject
              </Button>
            </>
          )}
          {canConvert && (
            <Button onClick={handleConvertToOrder} className="bg-indigo-600 hover:bg-indigo-700">
              Convert to Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Quote Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Customer</dt>
              <dd className="font-medium">{quote.customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Valid Until</dt>
              <dd className="font-medium">{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(quote.createdAt).toLocaleDateString()}</dd>
            </div>
            {quote.approvedAt && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Approved At</dt>
                <dd className="font-medium">{new Date(quote.approvedAt).toLocaleDateString()}</dd>
              </div>
            )}
            {quote.rejectedAt && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Rejected At</dt>
                <dd className="font-medium">{new Date(quote.rejectedAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Financial Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <span>{formatCurrency(quote.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax</span>
              <span>{formatCurrency(quote.tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>{formatCurrency(quote.total)}</span>
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
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Discount</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{item.product.name}</td>
                  <td className="px-4 py-2 text-sm">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-2 text-sm">{formatCurrency(item.discount)}</td>
                  <td className="px-4 py-2 text-sm font-medium">{formatCurrency(item.total)}</td>
                  <td className="px-4 py-2 text-sm text-slate-500">{item.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}