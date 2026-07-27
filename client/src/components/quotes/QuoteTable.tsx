// src/components/quotes/QuoteTable.tsx
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Quote } from '../../api/quote';
import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

export default function QuoteTable({ quotes, onEdit, onDelete, onApprove, onReject }: Props) {
  if (quotes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center text-lg">
        <p className="text-slate-500">No quotes found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white text-slate-900 text-lg">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Quote #</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Customer</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Total</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-lg font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {quotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/quotes/${quote.id}`} className="font-medium text-indigo-600 hover:underline">
                  {quote.quoteNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {quote.customer.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg font-medium">
                {formatCurrency(quote.total)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(quote.status)}`}>
                  {quote.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {new Date(quote.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-lg">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/quotes/${quote.id}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-lg">
                    <Eye size={16} />
                  </Link>
                  {(quote.status === 'DRAFT' || quote.status === 'SENT') && (
                    <>
                      <button onClick={() => onEdit(quote)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => onApprove(quote.id)} className="rounded-lg p-1 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => onReject(quote.id)} className="rounded-lg p-1 text-red-500 hover:bg-red-50 hover:text-red-700">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={() => onDelete(quote.id)} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}