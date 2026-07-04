import type { ReactNode } from "react";

type Props = {
  title: string;
  value: number;
  icon: ReactNode;
};

export default function KPI({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          {icon}
        </div>

      </div>

    </div>
  );
}