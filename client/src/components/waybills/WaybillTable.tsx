// src/components/waybills/WaybillTable.tsx
import { Eye, Truck, MapPin, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

import type { Waybill } from "../../api/waybill";
import { statusColor } from "../../utils/statusColor";

type Props = {
  waybills: Waybill[];
};

export default function WaybillTable({
  waybills,
}: Props) {
  if (waybills.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <Truck
          size={40}
          className="mx-auto mb-4 text-slate-300"
        />

        <p className="font-medium text-slate-600">
          No waybills found.
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Waybills will appear here once they are created.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* =========================================================
          MOBILE
      ========================================================= */}
      <div className="space-y-3 md:hidden">
        {waybills.map((waybill) => (
          <div
            key={waybill.id}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={`/waybills/${waybill.id}`}
                  className="
                    block
                    truncate
                    text-sm
                    font-bold
                    text-indigo-600
                    hover:underline
                  "
                >
                  {waybill.waybillNumber}
                </Link>

                <Link
                  to={`/invoices/${waybill.invoice.id}`}
                  className="
                    mt-1
                    block
                    truncate
                    text-xs
                    text-slate-500
                    hover:text-indigo-600
                  "
                >
                  Invoice {waybill.invoice.invoiceNumber}
                </Link>
              </div>

              <span
                className={`
                  shrink-0
                  rounded-full
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  ${statusColor(waybill.status)}
                `}
              >
                {waybill.status}
              </span>
            </div>

            {/* Destination */}
            <div className="mt-4 flex items-start gap-2">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Destination
                </p>

                <p className="truncate text-sm font-medium text-slate-700">
                  {waybill.destination}
                </p>
              </div>
            </div>

            {/* Vehicle / Driver */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Vehicle
                </p>

                <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                  {waybill.vehicle?.registrationNumber || "Not assigned"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Driver
                </p>

                <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                  {waybill.driver?.name || "Not assigned"}
                </p>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarDays size={14} />

                {new Date(
                  waybill.createdAt
                ).toLocaleDateString()}
              </div>

              <Link
                to={`/waybills/${waybill.id}`}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-slate-100
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-200
                "
              >
                <Eye size={14} />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          DESKTOP
      ========================================================= */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Waybill #
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Invoice
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Destination
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vehicle
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Driver
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Created
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {waybills.map((waybill) => (
              <tr
                key={waybill.id}
                className="transition hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-5 py-4">
                  <Link
                    to={`/waybills/${waybill.id}`}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    {waybill.waybillNumber}
                  </Link>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <Link
                    to={`/invoices/${waybill.invoice.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {waybill.invoice.invoiceNumber}
                  </Link>
                </td>

                <td className="max-w-[220px] px-5 py-4">
                  <p className="truncate text-sm text-slate-600">
                    {waybill.destination}
                  </p>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {waybill.vehicle?.registrationNumber || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {waybill.driver?.name || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${statusColor(waybill.status)}
                    `}
                  >
                    {waybill.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                  {new Date(
                    waybill.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <Link
                    to={`/waybills/${waybill.id}`}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      p-2
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-700
                    "
                    title="View waybill"
                  >
                    <Eye size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}