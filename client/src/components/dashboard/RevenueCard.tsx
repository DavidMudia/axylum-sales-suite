import {
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import Card from "../ui/Card";
import RevenueChart from "./RevenueChart";

type Props = {
  data: {
    month: string;
    revenue: number;
  }[];
};

export default function RevenueCard({
  data,
}: Props) {

  const revenue = data.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const currentMonth =
    data[data.length - 1]?.revenue ?? 0;

  return (
    <Card className="overflow-hidden">

      {/* Header */}

      <div className="flex flex-col gap-6 border-b border-slate-200/70 p-6 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <div className="rounded-xl bg-indigo-100 p-2">

              <TrendingUp
                size={18}
                className="text-indigo-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-slate-900">
                Revenue Overview
              </h2>

              <p className="text-sm text-slate-500">
                Monthly business performance
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Revenue
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              ₦{revenue.toLocaleString()}
            </h3>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current Month
            </p>

            <div className="mt-1 flex items-center gap-2">

              <h3 className="text-2xl font-bold text-slate-900">
                ₦{currentMonth.toLocaleString()}
              </h3>

              <span className="flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">

                <ArrowUpRight size={14} />

                18%

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Chart */}

      <div className="p-6">

        <RevenueChart
          data={data}
        />

      </div>

    </Card>
  );
}