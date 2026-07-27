// src/components/payments/PaymentTable.tsx
import { Link } from 'react-router-dom';
import type { Payment } from '../../api/payment';
import { formatCurrency } from '../../utils/currency';
import PaymentActions from './PaymentActions';

type Props = {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function PaymentTable({ payments, onEdit, onDelete, onApprove, onCancel }: Props) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center text-lg">
        <p className="text-slate-500">No payments found.</p>
      </div>
    );
  }

  const canApproveCancel = (status: string) => status === 'PENDING';

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white text-lg">
      <table className="min-w-full divide-y divide-slate-200 text-lg">
        <thead className="bg-slate-50 text-lg">
          <tr>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Payment #</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Invoice</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Customer</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Amount</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Method</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-lg font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-lg">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50 text-lg">
              <td className="whitespace-nowrap px-6 py-4 text-lg">
                {payment.id ? (
                  <Link to={`/payments/${payment.id}`} className="font-medium text-indigo-600 hover:underline text-lg">
                    {payment.paymentNumber}
                  </Link>
                ) : (
                  <span className="text-slate-400 text-lg">{payment.paymentNumber}</span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {payment.invoice?.id ? (
                  <Link to={`/invoices/${payment.invoice.id}`} className="text-indigo-600 hover:underline">
                    {payment.invoice?.invoiceNumber || `#${payment.invoiceId}`}
                  </Link>
                ) : (
                  <span className="text-slate-400 text-lg">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {payment.customer?.name || '—'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg font-medium">
                {formatCurrency(payment.amount)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {payment.paymentMethod}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-lg font-semibold ${
                    payment.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : payment.status === 'PENDING'
                      // ? 'bg-yellow-100 text-yellow-700'
                      // : payment.status === 'FAILED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <PaymentActions
                    onEdit={() => onEdit(payment)}
                    onDelete={() => onDelete(payment.id)}
                    onApprove={() => onApprove(payment.id)}
                    onCancel={() => onCancel(payment.id)}
                    showApprove={canApproveCancel(payment.status)}
                    showCancel={canApproveCancel(payment.status)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}