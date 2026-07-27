import {
  FileText,
  CreditCard,
  Receipt,
  TriangleAlert,
} from "lucide-react";

type Props = {
  alerts: {
    pendingQuotes: number;
    pendingPayments: number;
    overdueInvoices: number;
    lowStock: number;
  };
};

export default function AlertsCard({
  alerts,
}: Props) {
  const cards = [
    {
      title: "Pending Quotes",
      value: alerts.pendingQuotes,
      icon: FileText,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Pending Payments",
      value: alerts.pendingPayments,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Overdue Invoices",
      value: alerts.overdueInvoices,
      icon: Receipt,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Low Stock",
      value: alerts.lowStock,
      icon: TriangleAlert,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bg} rounded-xl border p-5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {card.value}
              </h2>
            </div>

            <card.icon
              size={34}
              className={card.color}
            />
          </div>
        </div>
      ))}
    </div>
  );
}