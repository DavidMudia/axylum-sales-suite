type Props = {
  invoices: any[];
  payments: any[];
  onOpenInvoice?: (id: number) => void;
  onOpenPayment?: (id: number) => void;
};

export default function RecentActivity({
  invoices,
  payments,
  onOpenInvoice,
  onOpenPayment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="border-b pb-3"
          >
            <p>
              Invoice{" "}
              <button
                onClick={() =>
                  onOpenInvoice?.(invoice.id)
                }
                className="font-semibold text-blue-600 hover:underline"
              >
                {invoice.invoiceNumber}
              </button>{" "}
              created.
            </p>

            <small className="text-gray-500">
              {new Date(
                invoice.createdAt
              ).toLocaleString()}
            </small>
          </div>
        ))}

        {payments.map((payment) => (
          <div
            key={payment.id}
            className="border-b pb-3"
          >
            <p>
              Payment{" "}
              <button
                onClick={() =>
                  onOpenPayment?.(payment.id)
                }
                className="font-semibold text-blue-600 hover:underline"
              >
                {payment.paymentNumber}
              </button>{" "}
              recorded.
            </p>

            <small className="text-gray-500">
              {new Date(
                payment.createdAt
              ).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}