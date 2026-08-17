import type { ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

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
  const positive =
    change !== undefined && change >= 0;

  return (
    <Card className="group h-full">
      <div className="flex items-start justify-between gap-2 sm:gap-3">

        {/* Content */}
        <div className="min-w-0 flex-1">

          <p
            className="
              truncate
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-slate-500
              sm:text-[11px]
              sm:tracking-[0.12em]
            "
          >
            {title}
          </p>

          <h2
            className="
              mt-1.5
              truncate
              text-xl
              font-bold
              tracking-tight
              text-slate-900
              sm:mt-2
              sm:text-2xl
            "
          >
            {value}
          </h2>

          {change !== undefined && (
            <div
              className="
                mt-2
                flex
                min-w-0
                items-center
                gap-1
                text-[10px]
                sm:mt-2
                sm:text-xs
              "
            >
              <span
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-0.5
                  font-semibold
                  ${
                    positive
                      ? "text-emerald-600"
                      : "text-red-600"
                  }
                `}
              >
                {positive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}

                {Math.abs(change)}%
              </span>

              {changeLabel && (
                <span
                  className="
                    min-w-0
                    truncate
                    text-slate-500
                  "
                >
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-slate-100
            ${iconColor}
            sm:h-10
            sm:w-10
            sm:rounded-xl
          `}
        >
          {icon}
        </div>

      </div>
    </Card>
  );
}