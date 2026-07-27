// src/components/customers/CustomerTable.tsx
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Customer } from '../../api/customer';
import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
};

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
        <p className="text-slate-500">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/customers/${customer.id}`} className="font-medium text-indigo-600 hover:underline">
                  {customer.name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {customer.companyName || '—'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {customer.phone || '—'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                {formatCurrency(customer.outstandingBalance)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {new Date(customer.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(customer)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
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