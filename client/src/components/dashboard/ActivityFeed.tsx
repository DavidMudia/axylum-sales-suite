import Card from "../ui/Card";
import {
  CheckCircle2,
  Package,
  ShoppingCart,
  Receipt,
  Truck,
  User,
  Clock3,
} from "lucide-react";

type Activity = {
  id: number;
  action: string;
  module: string;
  recordNumber: string | null;
  createdAt: string;
};

type Props = {
  activities: Activity[];
};

export default function ActivityFeed({
  activities,
}: Props) {
  return (
    <Card className="overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Everything happening across the business
          </p>

        </div>

      </div>

      {/* Timeline */}

      <div className="relative px-6 py-4">

        {/* vertical line */}

        <div className="absolute left-[31px] top-0 bottom-0 w-px bg-slate-200" />

        {activities.length === 0 && (

          <div className="py-12 text-center">

            <Clock3
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <p className="font-medium text-slate-600">
              No recent activity
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Activity will appear here as your team works.
            </p>

          </div>

        )}

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="relative flex gap-5 py-5"
          >

            {/* Timeline Icon */}

            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white shadow-sm">

              <ActivityIcon
                module={activity.module}
              />

            </div>

            {/* Content */}

            <div className="flex-1 rounded-xl border border-slate-200/70 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="font-semibold text-slate-900">
                    {activity.action}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.recordNumber ?? "System Activity"}
                  </p>

                </div>

                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}

function ActivityIcon({
  module,
}: {
  module: string;
}) {
  switch (module) {
    case "CUSTOMERS":
      return (
        <User
          size={18}
          className="text-blue-600"
        />
      );

    case "SALES":
      return (
        <ShoppingCart
          size={18}
          className="text-emerald-600"
        />
      );

    case "INVOICES":
      return (
        <Receipt
          size={18}
          className="text-orange-600"
        />
      );

    case "WAYBILLS":
      return (
        <Truck
          size={18}
          className="text-indigo-600"
        />
      );

    case "PRODUCTS":
      return (
        <Package
          size={18}
          className="text-purple-600"
        />
      );

    default:
      return (
        <CheckCircle2
          size={18}
          className="text-slate-600"
        />
      );
  }
}