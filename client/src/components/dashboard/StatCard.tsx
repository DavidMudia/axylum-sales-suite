import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "../ui/Card";

type Props = {
  title: string;
  value: string | number;
  icon: ReactNode;

  change?: number;
  changeLabel?: string;

  iconColor?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  iconColor = "text-indigo-600",
}: Props) {
  const positive = change !== undefined && change >= 0;

  return (
    <Card className="group h-full">
  <div className="flex items-start justify-between gap-6">

    <div className="min-w-0 flex-1">

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h2>

      {change !== undefined && (
        <div className="mt-5 flex items-center gap-2 text-sm">

          <span
            className={`flex items-center gap-1 font-semibold ${
              positive
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {positive
              ? <ArrowUpRight size={16} />
              : <ArrowDownRight size={16} />}

            {Math.abs(change)}%
          </span>

          {changeLabel && (
            <span className="text-slate-500">
              {changeLabel}
            </span>
          )}

        </div>
      )}

    </div>

    <div
      className={`
        flex
        h-14
        w-14
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-slate-100
        ${iconColor}
      `}
    >
      {icon}
    </div>

  </div>
</Card>
  );
}