type Props = {
  onCustomer: () => void;
  onProduct: () => void;
  onQuote: () => void;
  onInvoice: () => void;
  onPayment: () => void;
};

export default function QuickActions({
  onCustomer,
  onProduct,
  onQuote,
  onInvoice,
  onPayment,
}: Props) {
  const buttons = [
    {
      label: "New Customer",
      action: onCustomer,
    },
    {
      label: "New Product",
      action: onProduct,
    },
    {
      label: "New Quote",
      action: onQuote,
    },
    {
      label: "New Invoice",
      action: onInvoice,
    },
    {
      label: "New Payment",
      action: onPayment,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-4">
        {buttons.map((button) => (
          <button
            key={button.label}
            onClick={button.action}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}