// src/components/invoices/InvoiceTable.tsx
import { Edit, Trash2, Eye, CheckCircle, Printer, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Invoice } from '../../api/invoice';
import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onPrint: (id: number) => void;
  onGenerateWaybill?: (id: number) => void;
};

export default function InvoiceTable({ invoices, onEdit, onDelete, onApprove, onPrint, onGenerateWaybill }: Props) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center text-lg">
        <p className="text-slate-500 text-lg">No invoices found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white text-lg">
      <table className="min-w-full divide-y divide-slate-200 text-lg">
        <thead className="bg-slate-50 text-lg">
          <tr>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Invoice #</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Customer</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Total</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Balance</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Payment</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-lg font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-lg">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-slate-50 text-lg">
              <td className="whitespace-nowrap px-6 py-4 text-lg">
                <Link to={`/invoices/${invoice.id}`} className="font-medium text-indigo-600 hover:underline">
                  {invoice.invoiceNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {invoice.customer.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg font-medium">
                {formatCurrency(invoice.total)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg font-medium">
                {formatCurrency(invoice.balance)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-lg font-semibold ${invoice.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : invoice.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {invoice.paymentStatus}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/invoices/${invoice.id}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Eye size={16} />
                  </Link>
                  {!invoice.isPrinted && (
                    <button onClick={() => onPrint(invoice.id)} className="rounded-lg p-1 text-blue-500 hover:bg-blue-50 hover:text-blue-700">
                      <Printer size={16} />
                    </button>
                  )}
                  {invoice.status === 'UNPAID' && !invoice.isApproved && (
                    <button onClick={() => onApprove(invoice.id)} className="rounded-lg p-1 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  {onGenerateWaybill && invoice.isApproved && (
                    <button onClick={() => onGenerateWaybill(invoice.id)} className="rounded-lg p-1 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700">
                      <Truck size={16} />
                    </button>
                  )}
                  <button onClick={() => onEdit(invoice)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onDelete(invoice.id)} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
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