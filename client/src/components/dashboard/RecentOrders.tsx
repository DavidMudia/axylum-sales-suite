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
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-slate-200/70
          px-4
          py-4
          sm:px-5
          sm:py-5
          lg:px-6
        "
      >
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            Recent Orders
          </h2>

          <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
            Latest sales orders received
          </p>
        </div>

        <button
          className="
            flex
            shrink-0
            items-center
            gap-1
            text-xs
            font-medium
            text-slate-600
            transition
            hover:text-slate-900
            sm:gap-2
            sm:text-sm
          "
        >
          <span>View All</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Orders */}
      <div>
        {orders.length === 0 && (
          <div className="px-4 py-10 text-center sm:px-6">
            <ShoppingCart
              className="mx-auto mb-4 text-slate-300"
              size={40}
            />

            <p className="font-medium text-slate-600">
              No recent orders
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Orders will appear here once created.
            </p>
          </div>
        )}

        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`
              flex
              flex-col
              gap-4
              px-4
              py-4
              transition
              hover:bg-slate-50
              sm:px-5
              sm:py-5
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-6
              ${
                index !== orders.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }
            `}
          >

            {/* Order Information */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-100
                  sm:h-12
                  sm:w-12
                "
              >
                <ShoppingCart
  size={18}
  className="text-indigo-600 sm:h-5 sm:w-5"
/>
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-900
                    sm:text-base
                  "
                  title={order.orderNumber}
                >
                  {order.orderNumber}
                </h3>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-slate-500
                    sm:text-sm
                  "
                  title={
                    order.customer?.name ??
                    "Walk-in Customer"
                  }
                >
                  {order.customer?.name ??
                    "Walk-in Customer"}
                </p>
              </div>
            </div>

            {/* Amount + Status */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-t
                border-slate-100
                pt-3
                lg:border-0
                lg:pt-0
                lg:justify-end
              "
            >

              {/* Amount */}
              <div className="min-w-0">
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                    sm:text-xs
                  "
                >
                  Amount
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-sm
                    font-semibold
                    text-slate-900
                    sm:text-base
                  "
                >
                  ₦{Number(order.total).toLocaleString()}
                </p>
              </div>

              {/* Status */}
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