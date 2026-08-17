// src/components/invoices/InvoiceTable.tsx
import {
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Printer,
  Truck,
  FileText,
} from "lucide-react";

import { Link } from "react-router-dom";
import type { Invoice } from "../../api/invoice";
import { statusColor } from "../../utils/statusColor";
import { formatCurrency } from "../../utils/currency";

type Props = {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onPrint: (id: number) => void;
  onGenerateWaybill?: (id: number) => void;
};

export default function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
  onApprove,
  onPrint,
  onGenerateWaybill,
}: Props) {
  if (invoices.length === 0) {
    return (
      <div className="
        rounded-xl
        border
        border-slate-200
        bg-white
        px-5
        py-16
        text-center
        sm:rounded-2xl
        sm:py-24
      ">
        <FileText
          size={40}
          className="mx-auto mb-4 text-slate-300"
        />

        <p className="text-base font-medium text-slate-600">
          No invoices found.
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ========================================================= */}
      {/* MOBILE VIEW                                               */}
      {/* ========================================================= */}

      <div className="space-y-3 md:hidden">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            {/* Top */}
            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <Link
                  to={`/invoices/${invoice.id}`}
                  className="
                    flex
                    items-center
                    gap-2
                    text-base
                    font-semibold
                    text-indigo-600
                  "
                >
                  <FileText size={16} />
                  {invoice.invoiceNumber}
                </Link>

                <p className="
                  mt-1
                  truncate
                  text-sm
                  font-medium
                  text-slate-700
                ">
                  {invoice.customer.name}
                </p>

              </div>

              {/* Invoice status */}
              <span
                className={`
                  shrink-0
                  rounded-full
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  ${statusColor(invoice.status)}
                `}
              >
                {invoice.status}
              </span>

            </div>

            {/* Financial information */}
            <div className="
              mt-4
              grid
              grid-cols-2
              gap-3
              rounded-lg
              bg-slate-50
              p-3
            ">

              <div>
                <p className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                ">
                  Total
                </p>

                <p className="
                  mt-0.5
                  text-base
                  font-bold
                  text-slate-900
                ">
                  {formatCurrency(invoice.total)}
                </p>
              </div>

              <div>
                <p className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                ">
                  Balance
                </p>

                <p className="
                  mt-0.5
                  text-base
                  font-bold
                  text-slate-900
                ">
                  {formatCurrency(invoice.balance)}
                </p>
              </div>

            </div>

            {/* Payment + date */}
            <div className="
              mt-3
              flex
              items-center
              justify-between
              gap-3
            ">

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  ${
                    invoice.paymentStatus === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : invoice.paymentStatus === "PARTIAL"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {invoice.paymentStatus}
              </span>

              <span className="text-xs text-slate-400">
                {new Date(
                  invoice.createdAt
                ).toLocaleDateString()}
              </span>

            </div>

            {/* Actions */}
            <div className="
              mt-4
              flex
              items-center
              gap-2
              border-t
              border-slate-100
              pt-3
            ">

              {/* View */}
              <Link
                to={`/invoices/${invoice.id}`}
                className="
                  flex
                  h-9
                  flex-1
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  bg-slate-100
                  text-xs
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-200
                "
              >
                <Eye size={15} />
                View
              </Link>

              {/* Print */}
              {!invoice.isPrinted && (
                <button
                  onClick={() => onPrint(invoice.id)}
                  className="
                    flex
                    h-9
                    flex-1
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    bg-blue-50
                    text-xs
                    font-medium
                    text-blue-700
                    transition
                    hover:bg-blue-100
                  "
                >
                  <Printer size={15} />
                  Print
                </button>
              )}

              {/* Approve */}
              {invoice.status === "UNPAID" &&
                !invoice.isApproved && (
                  <button
                    onClick={() =>
                      onApprove(invoice.id)
                    }
                    className="
                      flex
                      h-9
                      flex-1
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-emerald-50
                      text-xs
                      font-medium
                      text-emerald-700
                      transition
                      hover:bg-emerald-100
                    "
                  >
                    <CheckCircle size={15} />
                    Approve
                  </button>
                )}

              {/* Waybill */}
              {onGenerateWaybill &&
                invoice.isApproved && (
                  <button
                    onClick={() =>
                      onGenerateWaybill(invoice.id)
                    }
                    className="
                      flex
                      h-9
                      flex-1
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-indigo-50
                      text-xs
                      font-medium
                      text-indigo-700
                      transition
                      hover:bg-indigo-100
                    "
                  >
                    <Truck size={15} />
                    Waybill
                  </button>
                )}

              {/* Edit */}
              <button
                onClick={() => onEdit(invoice)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
                aria-label="Edit invoice"
              >
                <Edit size={16} />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(invoice.id)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
                aria-label="Delete invoice"
              >
                <Trash2 size={16} />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP VIEW                                              */}
      {/* ========================================================= */}

      <div className="
        hidden
        overflow-x-auto
        rounded-2xl
        border
        border-slate-200
        bg-white
        md:block
      ">

        <table className="
          min-w-full
          divide-y
          divide-slate-200
        ">

          <thead className="bg-slate-50">
            <tr>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Invoice #
              </th>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Customer
              </th>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Total
              </th>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Balance
              </th>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Status
              </th>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Payment
              </th>

              <th className="
                px-5
                py-3
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Created
              </th>

              <th className="
                px-5
                py-3
                text-right
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                lg:px-6
              ">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="
            divide-y
            divide-slate-100
            bg-white
          ">

            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="
                  transition
                  hover:bg-slate-50/80
                "
              >

                {/* Invoice */}
                <td className="whitespace-nowrap px-5 py-4 lg:px-6">

                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="
                      font-semibold
                      text-indigo-600
                      hover:underline
                    "
                  >
                    {invoice.invoiceNumber}
                  </Link>

                </td>

                {/* Customer */}
                <td className="
                  max-w-[220px]
                  truncate
                  whitespace-nowrap
                  px-5
                  py-4
                  text-sm
                  text-slate-700
                  lg:px-6
                ">
                  {invoice.customer.name}
                </td>

                {/* Total */}
                <td className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  text-slate-900
                  lg:px-6
                ">
                  {formatCurrency(invoice.total)}
                </td>

                {/* Balance */}
                <td className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-sm
                  font-medium
                  text-slate-700
                  lg:px-6
                ">
                  {formatCurrency(invoice.balance)}
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-5 py-4 lg:px-6">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${statusColor(invoice.status)}
                    `}
                  >
                    {invoice.status}
                  </span>

                </td>

                {/* Payment */}
                <td className="whitespace-nowrap px-5 py-4 lg:px-6">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${
                        invoice.paymentStatus === "PAID"
                          ? "bg-emerald-100 text-emerald-700"
                          : invoice.paymentStatus === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {invoice.paymentStatus}
                  </span>

                </td>

                {/* Created */}
                <td className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-sm
                  text-slate-500
                  lg:px-6
                ">
                  {new Date(
                    invoice.createdAt
                  ).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-right
                  lg:px-6
                ">

                  <div className="
                    flex
                    items-center
                    justify-end
                    gap-1
                  ">

                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                      "
                      title="View invoice"
                    >
                      <Eye size={16} />
                    </Link>

                    {!invoice.isPrinted && (
                      <button
                        onClick={() =>
                          onPrint(invoice.id)
                        }
                        className="
                          rounded-lg
                          p-2
                          text-blue-500
                          transition
                          hover:bg-blue-50
                          hover:text-blue-700
                        "
                        title="Print invoice"
                      >
                        <Printer size={16} />
                      </button>
                    )}

                    {invoice.status === "UNPAID" &&
                      !invoice.isApproved && (
                        <button
                          onClick={() =>
                            onApprove(invoice.id)
                          }
                          className="
                            rounded-lg
                            p-2
                            text-emerald-500
                            transition
                            hover:bg-emerald-50
                            hover:text-emerald-700
                          "
                          title="Approve invoice"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                    {onGenerateWaybill &&
                      invoice.isApproved && (
                        <button
                          onClick={() =>
                            onGenerateWaybill(
                              invoice.id
                            )
                          }
                          className="
                            rounded-lg
                            p-2
                            text-indigo-500
                            transition
                            hover:bg-indigo-50
                            hover:text-indigo-700
                          "
                          title="Generate waybill"
                        >
                          <Truck size={16} />
                        </button>
                      )}

                    <button
                      onClick={() =>
                        onEdit(invoice)
                      }
                      className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                      "
                      title="Edit invoice"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(invoice.id)
                      }
                      className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                      "
                      title="Delete invoice"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </>
  );
}