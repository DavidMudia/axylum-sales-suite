import {
  CheckCircle,
  Eye,
  XCircle,
  FilePlus2,
} from "lucide-react";

type Props = {
  quotes: any[];
  payments: any[];

  onOpenQuote?: (id: number) => void;
  onApproveQuote?: (id: number) => void;
  onRejectQuote?: (id: number) => void;
  onConvertQuote?: (id: number) => void;

  onOpenPayment?: (id: number) => void;
  onValidatePayment?: (id: number) => void;
};

export default function ApprovalQueue({
  quotes,
  payments,

  onOpenQuote,
  onApproveQuote,
  onRejectQuote,
  onConvertQuote,

  onOpenPayment,
  onValidatePayment,
}: Props) {
  const pendingQuotes = quotes.filter(
    (q) => q.status === "DRAFT"
  );

  const pendingPayments = payments.filter(
    (p) => p.status === "PENDING"
  );

  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-semibold">
        Approval Queue
      </h2>

      {/* Quotes */}

      <div className="mb-10">

        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">
            Pending Quotes
          </h3>

          <span className="rounded bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            {pendingQuotes.length}
          </span>
        </div>

        {pendingQuotes.length === 0 && (
          <p className="text-sm text-gray-500">
            No pending quotes.
          </p>
        )}

        <div className="space-y-3">

          {pendingQuotes.map((quote) => (

            <div
              key={quote.id}
              className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
            >

              <div>

                <p className="font-semibold">
                  {quote.quoteNumber}
                </p>

                <p className="text-sm text-gray-500">
                  {quote.customer?.name}
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() =>
                    onApproveQuote?.(quote.id)
                  }
                  className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button
                  onClick={() =>
                    onRejectQuote?.(quote.id)
                  }
                  className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                >
                  <XCircle size={16} />
                  Reject
                </button>

                <button
                  onClick={() =>
                    onConvertQuote?.(quote.id)
                  }
                  className="flex items-center gap-2 rounded bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700"
                >
                  <FilePlus2 size={16} />
                  Convert
                </button>

                <button
                  onClick={() =>
                    onOpenQuote?.(quote.id)
                  }
                  className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                >
                  <Eye size={16} />
                  Open
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Payments */}

      <div>

        <div className="mb-3 flex items-center justify-between">

          <h3 className="font-semibold">
            Pending Payments
          </h3>

          <span className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            {pendingPayments.length}
          </span>

        </div>

        {pendingPayments.length === 0 && (
          <p className="text-sm text-gray-500">
            No pending payments.
          </p>
        )}

        <div className="space-y-3">

          {pendingPayments.map((payment) => (

            <div
              key={payment.id}
              className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
            >

              <div>

                <p className="font-semibold">
                  {payment.paymentNumber}
                </p>

                <p className="text-sm text-gray-500">
                  ₦{payment.amount.toLocaleString()}
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() =>
                    onValidatePayment?.(
                      payment.id
                    )
                  }
                  className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                >
                  <CheckCircle size={16} />
                  Validate
                </button>

                <button
                  onClick={() =>
                    onOpenPayment?.(
                      payment.id
                    )
                  }
                  className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                >
                  <Eye size={16} />
                  Open
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}