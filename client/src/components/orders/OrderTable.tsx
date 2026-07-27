// src/components/orders/OrderTable.tsx
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Order } from '../../api/order';
import { statusColor } from '../../utils/statusColor';
import { formatCurrency } from '../../utils/currency';

type Props = {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function OrderTable({ orders, onEdit, onDelete, onApprove, onCancel }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center text-lg">
        <p className="text-slate-500">No orders found.</p>
      </div>
    );
  }

  const canApproveCancel = (status: string) => status !== 'DELIVERED' && status !== 'CANCELLED';

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Order #</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Customer</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Total</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-lg font-medium uppercase tracking-wider text-slate-500">Created</th>
            <th className="px-6 py-3 text-right text-lg font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-lg">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/orders/${order.id}`} className="font-medium text-indigo-600 hover:underline">
                  {order.orderNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {order.customer.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg font-medium">
                {formatCurrency(order.total)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-lg font-semibold ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-lg text-slate-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/orders/${order.id}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <Eye size={16} />
                  </Link>
                  {canApproveCancel(order.status) && (
                    <>
                      <button onClick={() => onEdit(order)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => onApprove(order.id)} className="rounded-lg p-1 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => onCancel(order.id)} className="rounded-lg p-1 text-red-500 hover:bg-red-50 hover:text-red-700">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={() => onDelete(order.id)} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
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