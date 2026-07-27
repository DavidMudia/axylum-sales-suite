// src/pages/CreateWaybill.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useCreateWaybill } from '../hooks/useWaybills';
import { useInvoices } from '../hooks/useInvoices';
// import { useVehicles } from '../hooks/useVehicles';
// import { useDrivers } from '../hooks/useDrivers';
import { useWarehouses } from '../hooks/useWarehouses';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';

const createWaybillSchema = z.object({
  invoiceId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  vehicleId: z.number().int().positive(),
  driverId: z.number().int().positive(),
  destination: z.string().min(3),
});

type FormData = z.infer<typeof createWaybillSchema>;

export default function CreateWaybill() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: invoices } = useInvoices();
  const { data: warehouses } = useWarehouses();
//   const { data: vehicles } = useVehicles();
//   const { data: drivers } = useDrivers();

  const createMutation = useCreateWaybill();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createWaybillSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
      navigate('/waybills');
    } catch (error) {
      alert('Failed to create waybill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/waybills')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <PageHeader title="Create Waybill" subtitle="Generate a delivery waybill for an invoice." />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Invoice *</label>
            <select
              {...register('invoiceId', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">Select invoice</option>
              {invoices?.data?.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} – {inv.customer.name}
                </option>
              ))}
            </select>
            {errors.invoiceId && <p className="mt-1 text-sm text-red-600">{errors.invoiceId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Warehouse *</label>
            <select
              {...register('warehouseId', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">Select warehouse</option>
              {warehouses?.data?.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            {errors.warehouseId && <p className="mt-1 text-sm text-red-600">{errors.warehouseId.message}</p>}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-slate-700">Vehicle *</label>
            <select
              {...register('vehicleId', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">Select vehicle</option>
              {vehicles?.data?.map((v) => (
                <option key={v.id} value={v.id}>{v.registrationNumber}</option>
              ))}
            </select>
            {errors.vehicleId && <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>}
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-slate-700">Driver *</label>
            <select
              {...register('driverId', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              <option value="">Select driver</option>
              {drivers?.data?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {errors.driverId && <p className="mt-1 text-sm text-red-600">{errors.driverId.message}</p>}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-slate-700">Destination *</label>
            <Input {...register('destination')} placeholder="Delivery address or location" />
            {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/waybills')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Waybill'}
          </Button>
        </div>
      </form>
    </div>
  );
}