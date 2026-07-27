import {
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

type Order = {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  customer: {
    name: string;
  };
};

type Props = {
  orders: Order[];
};

export default function RecentOrders({
  orders,
}: Props) {
  return (
    <Card className="overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest sales orders received
          </p>

        </div>

        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">

          View All

          <ArrowRight size={16} />

        </button>

      </div>

      {/* Orders */}

      <div>

        {orders.length === 0 && (

          <div className="p-10 text-center">

            <ShoppingCart
              className="mx-auto mb-4 text-slate-300"
              size={42}
            />

            <p className="font-medium text-slate-600">
              No recent orders
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Orders will appear here once created.
            </p>

          </div>

        )}

        {orders.map((order) => (

          <div
            key={order.id}
            className="
              flex
              flex-col
              gap-4
              border-b
              border-slate-100
              p-6
              transition
              hover:bg-slate-50
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* Left */}

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">

                <ShoppingCart
                  size={20}
                  className="text-indigo-600"
                />

              </div>

              <div>

                <h3 className="font-semibold text-slate-900">
                  {order.orderNumber}
                </h3>

                <p className="text-sm text-slate-500">
                  {order.customer?.name ?? "Walk-in Customer"}
                </p>

              </div>

            </div>

            {/* Right */}

            <div className="flex items-center justify-between gap-6 md:justify-end">

              <div className="text-right">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Amount
                </p>

                <p className="font-semibold text-slate-900">
                  ₦{Number(order.total).toLocaleString()}
                </p>

              </div>

              <Badge
                color={
                  order.status === "APPROVED"
                    ? "green"
                    : order.status === "PENDING"
                    ? "yellow"
                    : order.status === "CANCELLED"
                    ? "red"
                    : "blue"
                }
              >
                {order.status}
              </Badge>

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}