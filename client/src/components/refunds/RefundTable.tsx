// src/components/refunds/RefundTable.tsx
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Refund } from '../../api/refund';
import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  refunds: Refund[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

export default function RefundTable({ refunds, onApprove, onReject }: Props) {
  if (refunds.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
        <p className="text-slate-500">No refunds found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white text-slate-900">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Refund #</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Invoice</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {refunds.map((refund) => (
            <tr key={refund.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/refunds/${refund.id}`} className="font-medium text-indigo-600 hover:underline">
                  {refund.refundNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {refund.customer.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                <Link to={`/invoices/${refund.invoice.id}`} className="text-indigo-600 hover:underline">
                  {refund.invoice.invoiceNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                {formatCurrency(refund.amount)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {refund.refundMethod}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(refund.status)}`}>
                  {refund.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {new Date(refund.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/refunds/${refund.id}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Eye size={16} />
                  </Link>
                  {refund.status === 'PENDING' && (
                    <>
                      <button onClick={() => onApprove(refund.id)} className="rounded-lg p-1 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => onReject(refund.id)} className="rounded-lg p-1 text-red-500 hover:bg-red-50 hover:text-red-700">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}