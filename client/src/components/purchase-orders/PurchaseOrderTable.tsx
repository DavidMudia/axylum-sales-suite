// src/components/purchase-orders/PurchaseOrderTable.tsx
import { Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PurchaseOrder } from '../../api/purchase-order';
import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  orders: PurchaseOrder[];
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void; // ✅ added
};

export default function PurchaseOrderTable({ orders, onEdit, onDelete, onApprove }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center">
        <p className="text-slate-500">No purchase orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">PO Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Supplier</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Warehouse</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/purchase-orders/${order.id}`} className="font-medium text-indigo-600 hover:underline">
                  {order.purchaseOrderNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{order.supplier.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{order.warehouse.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{formatCurrency(order.total)}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/purchase-orders/${order.id}`}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit(order)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(order.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  {/* ✅ Approve button – only show if status allows */}
                  {(order.status === 'DRAFT' || order.status === 'PENDING_APPROVAL') && (
                    <button
                      onClick={() => onApprove(order.id)}
                      className="rounded-lg p-1 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
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