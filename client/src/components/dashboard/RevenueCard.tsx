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
      <div className="border-b border-slate-200/70">
        <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">

          {/* Title */}
          <div className="flex min-w-0 items-center gap-3">
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
              "
            >
              <TrendingUp
                size={18}
                className="text-indigo-600"
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-lg
                  font-semibold
                  text-slate-900
                  sm:text-xl
                "
              >
                Revenue Overview
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Monthly business performance
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div
            className="
              grid
              grid-cols-2
              divide-x
              divide-slate-200
              rounded-xl
              bg-slate-50
              lg:min-w-[380px]
            "
          >
            {/* Total Revenue */}
            <div className="min-w-0 px-3 py-3 sm:px-4">
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-500
                  sm:text-xs
                "
              >
                Total Revenue
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-lg
                  font-bold
                  text-slate-900
                  sm:text-xl
                  lg:text-2xl
                "
                title={`₦${revenue.toLocaleString()}`}
              >
                ₦{revenue.toLocaleString()}
              </p>
            </div>

            {/* Current Month */}
            <div className="min-w-0 px-3 py-3 sm:px-4">
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-500
                  sm:text-xs
                "
              >
                Current Month
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <p
                  className="
                    min-w-0
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                    sm:text-xl
                    lg:text-2xl
                  "
                  title={`₦${currentMonth.toLocaleString()}`}
                >
                  ₦{currentMonth.toLocaleString()}
                </p>

                <span
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-0.5
                    rounded-full
                    bg-emerald-100
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-semibold
                    text-emerald-700
                    sm:px-2
                    sm:py-1
                    sm:text-xs
                  "
                >
                  <ArrowUpRight size={12} />
                  18%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        className="
          px-3
          py-4
          sm:p-5
          lg:p-6
        "
      >
        <RevenueChart data={data} />
      </div>
    </Card>
  );
}