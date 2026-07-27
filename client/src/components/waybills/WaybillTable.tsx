// src/components/waybills/WaybillTable.tsx
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Waybill } from '../../api/waybill';
import { statusColor } from '../../utils/statusColor';
// import { formatCurrency } from '../../utils/currency';

type Props = {
  waybills: Waybill[];
};

export default function WaybillTable({ waybills }: Props) {
  if (waybills.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
        <p className="text-slate-500">No waybills found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Waybill #</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Invoice</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Destination</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Vehicle</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Driver</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {waybills.map((waybill) => (
            <tr key={waybill.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/waybills/${waybill.id}`} className="font-medium text-indigo-600 hover:underline">
                  {waybill.waybillNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                <Link to={`/invoices/${waybill.invoice.id}`} className="text-indigo-600 hover:underline">
                  {waybill.invoice.invoiceNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {waybill.destination}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {waybill.vehicle?.registrationNumber || '—'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {waybill.driver?.name || '—'}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(waybill.status)}`}>
                  {waybill.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {new Date(waybill.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <Link to={`/waybills/${waybill.id}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <Eye size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}