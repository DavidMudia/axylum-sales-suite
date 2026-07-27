// src/pages/WaybillDetails.tsx
import { useParams, Link } from 'react-router-dom';
import { useWaybill, useUpdateWaybillStatus } from '../hooks/useWaybills';
import PageHeader from '../components/ui/PageHeader';
import { statusColor } from '../utils/statusColor';
import Button from '../components/ui/Button';
import { ArrowLeft, Printer } from 'lucide-react';

export default function WaybillDetails() {
  const { id } = useParams<{ id: string }>();
  const waybillId = Number(id);
  const { data: waybill, isLoading } = useWaybill(waybillId);
  const updateStatusMutation = useUpdateWaybillStatus();

  const handleStatusUpdate = async (status: any) => {
    if (!confirm(`Update status to ${status}?`)) return;
    await updateStatusMutation.mutateAsync({ id: waybillId, status });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!waybill) {
    return <div className="rounded-2xl border bg-white p-12 text-center">Waybill not found.</div>;
  }

  const statusFlow = ['PENDING', 'LOADING', 'IN_TRANSIT', 'DELIVERED'];
  const currentIndex = statusFlow.indexOf(waybill.status);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  return (
    <div className="space-y-8 print:space-y-4 print:p-4 text-slate-900">
      {/* Header – hide in print */}
      <div className="flex items-center justify-between print:hidden">
        <PageHeader
          title={`Waybill #${waybill.waybillNumber}`}
          subtitle={`Invoice: ${waybill.invoice.invoiceNumber}`}
        />
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(waybill.status)}`}>
            {waybill.status}
          </span>
          {nextStatus && (
            <Button onClick={() => handleStatusUpdate(nextStatus)} className="bg-blue-600 hover:bg-blue-700">
              Mark as {nextStatus}
            </Button>
          )}
          <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700">
            <Printer size={18} className="mr-2" /> Print
          </Button>
        </div>
      </div>

      {/* Page content – always visible, printable */}
      <div className="grid gap-6 md:grid-cols-2 text-slate-900">
        <div className="rounded-2xl border bg-white p-6 shadow-sm print:border print:shadow-none">
          <h3 className="text-sm font-semibold text-slate-500">Waybill Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Waybill Number</dt>
              <dd className="font-medium">{waybill.waybillNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Invoice</dt>
              <dd className="font-medium">
                <Link to={`/invoices/${waybill.invoice.id}`} className="text-indigo-600 hover:underline print:text-black">
                  {waybill.invoice.invoiceNumber}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Destination</dt>
              <dd className="font-medium">{waybill.destination}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Warehouse</dt>
              <dd className="font-medium">{waybill.warehouse.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Vehicle</dt>
              <dd className="font-medium">{waybill.vehicle?.registrationNumber || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Driver</dt>
              <dd className="font-medium">{waybill.driver?.name || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor(waybill.status)}`}>
                  {waybill.status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">{new Date(waybill.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm print:border print:shadow-none">
          <h3 className="text-sm font-semibold text-slate-500">Items</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {waybill.items.map((item) => (
              <li key={item.id} className="flex justify-between border-b pb-2 last:border-0">
                <span>{item.product.name}</span>
                <span>x{item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-4 text-sm font-semibold">
            <span>Total Items: {waybill.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
          </div>
        </div>
      </div>

      {/* Signature section (for print) */}
      <div className="mt-8 grid grid-cols-2 gap-8 print:grid-cols-2">
        <div className="border-t border-slate-300 pt-2">
          <p className="text-xs text-slate-500">Driver Signature</p>
          <p className="mt-6 text-sm text-slate-400">_________________________</p>
        </div>
        <div className="border-t border-slate-300 pt-2">
          <p className="text-xs text-slate-500">Recipient Signature</p>
          <p className="mt-6 text-sm text-slate-400">_________________________</p>
        </div>
      </div>

      {/* Back button – hide in print */}
      <div className="flex justify-start print:hidden">
        <Link to="/waybills" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Back to Waybills
        </Link>
      </div>
    </div>
  );
}