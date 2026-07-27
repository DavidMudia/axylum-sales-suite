// src/components/payments/PaymentForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useInvoices } from "../../hooks/useInvoices";
import { useCreatePayment, useUpdatePayment } from "../../hooks/usePayments";

type FormData = {
  invoiceId: number;
  customerId: number;
  amount: number;
  paymentMethod: "TRANSFER" | "CASH" | "CARD" | "CHEQUE" | "OTHER";
  transactionId?: string;
  notes?: string;
};

type Props = {
  onClose: () => void;
  defaultValues?: any;
  paymentId?: number;
};

export default function PaymentForm({ onClose, defaultValues, paymentId }: Props) {
  const create = useCreatePayment();
  const update = useUpdatePayment();

  const { data: invoicesData } = useInvoices();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      invoiceId: 0,
      customerId: 0,
      amount: 0,
      paymentMethod: "TRANSFER",
      transactionId: "",
      notes: "",
      ...defaultValues,
    },
  });

  const invoiceId = watch("invoiceId");

  const invoices = invoicesData?.data ?? [];
  const selectedInvoice = invoices.find((inv: any) => inv.id === Number(invoiceId));

  useEffect(() => {
    if (!paymentId && selectedInvoice) {
      setValue("customerId", selectedInvoice.customerId);
      const balance = selectedInvoice.balance ?? selectedInvoice.total;
      setValue("amount", balance);
    }
  }, [paymentId, selectedInvoice, setValue]);

  const unpaidInvoices = invoices.filter((inv: any) => (inv.balance ?? inv.total) > 0);

  function submit(data: FormData) {
    const payload = {
      ...data,
      customerId: selectedInvoice?.customerId ?? data.customerId,
    };

    if (paymentId) {
      update.mutate(
        { id: paymentId, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      create.mutate(payload, { onSuccess: () => onClose() });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Invoice</label>
        <select
          {...register("invoiceId", { valueAsNumber: true })}
          className="w-full rounded-lg border p-3"
        >
          <option value={0}>Select Invoice</option>
          {unpaidInvoices.map((invoice: any) => {
            const balance = invoice.balance ?? invoice.total;
            return (
              <option key={invoice.id} value={invoice.id}>
                {invoice.invoiceNumber} • ₦{invoice.total.toLocaleString()} (Balance: ₦{balance.toLocaleString()})
              </option>
            );
          })}
        </select>
      </div>

      {selectedInvoice && (
        <div className="rounded-lg border bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold">Invoice Summary</h3>
          <div className="space-y-1 text-sm">
            <p>Customer: {selectedInvoice.customer?.name}</p>
            <p>Invoice: {selectedInvoice.invoiceNumber}</p>
            <p>Total: ₦{selectedInvoice.total.toLocaleString()}</p>
            <p>Balance: ₦{(selectedInvoice.balance ?? selectedInvoice.total).toLocaleString()}</p>
            <p>Status: {selectedInvoice.status}</p>
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="w-full rounded-lg border p-3"
        />
        {errors.amount && <p className="mt-1 text-sm text-red-500">Amount is required.</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Payment Method</label>
        <select {...register("paymentMethod")} className="w-full rounded-lg border p-3">
          <option value="TRANSFER">Bank Transfer</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="CHECK">Check</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Transaction ID</label>
        <input {...register("transactionId")} className="w-full rounded-lg border p-3" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Notes</label>
        <textarea rows={4} {...register("notes")} className="w-full rounded-lg border p-3" />
      </div>

      <button
        type="submit"
        disabled={create.isPending || update.isPending}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {create.isPending || update.isPending
          ? "Saving..."
          : paymentId
          ? "Update Payment"
          : "Record Payment"}
      </button>
    </form>
  );
}