type Props = {
  customers: any[];
  quotes: any[];
  invoices: any[];
};

export default function RecentlyCreated({
  customers,
  quotes,
  invoices,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">
        Recently Created
      </h2>

      <div className="space-y-4">

        <div>
          <h3 className="font-semibold">
            Customers
          </h3>

          {customers.map((customer) => (
            <p key={customer.id}>
              {customer.name}
            </p>
          ))}
        </div>

        <div>
          <h3 className="font-semibold">
            Quotes
          </h3>

          {quotes.map((quote) => (
            <p key={quote.id}>
              {quote.quoteNumber}
            </p>
          ))}
        </div>

        <div>
          <h3 className="font-semibold">
            Invoices
          </h3>

          {invoices.map((invoice) => (
            <p key={invoice.id}>
              {invoice.invoiceNumber}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}