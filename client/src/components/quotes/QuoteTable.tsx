// src/components/quotes/QuoteTable.tsx

import {
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import type { Quote } from "../../api/quote";

import { statusColor } from "../../utils/statusColor";
import { formatCurrency } from "../../utils/currency";

type Props = {
  quotes: Quote[];

  onEdit: (quote: Quote) => void;

  onDelete: (id: number) => void;

  onApprove: (id: number) => void;

  onReject: (id: number) => void;
};

export default function QuoteTable({
  quotes,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: Props) {
  /* ================================
     EMPTY STATE
  ================================= */

  if (quotes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-slate-500">
          No quotes found.
        </p>
      </div>
    );
  }

  /* ================================
     MOBILE
  ================================= */

  return (
    <>
      <div className="space-y-3 md:hidden">
        {quotes.map((quote) => {
          const canTakeAction =
            quote.status === "DRAFT" ||
            quote.status === "SENT";

          return (
            <div
              key={quote.id}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                shadow-sm
                transition
                hover:shadow-md
              "
            >
              {/* =========================
                  TOP SECTION
              ========================== */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/quotes/${quote.id}`}
                    className="
                      text-base
                      font-semibold
                      text-indigo-600
                      hover:underline
                    "
                  >
                    {quote.quoteNumber}
                  </Link>

                  <p className="mt-0.5 truncate text-sm text-slate-600">
                    {quote.customer.name}
                  </p>
                </div>

                <span
                  className={`
                    shrink-0
                    rounded-full
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    ${statusColor(quote.status)}
                  `}
                >
                  {quote.status.replaceAll("_", " ")}
                </span>
              </div>

              {/* =========================
                  QUOTE INFORMATION
              ========================== */}

              <div
                className="
                  mt-3
                  flex
                  items-end
                  justify-between
                  gap-4
                  border-t
                  border-slate-100
                  pt-3
                "
              >
                <div>
                  <p
                    className="
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Total
                  </p>

                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {formatCurrency(quote.total)}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Created
                  </p>

                  <p className="mt-0.5 text-sm text-slate-600">
                    {new Date(
                      quote.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* =========================
                  ACTIONS
              ========================== */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  border-t
                  border-slate-100
                  pt-2
                "
              >
                {/* View */}

                <Link
                  to={`/quotes/${quote.id}`}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2
                    py-1.5
                    text-xs
                    font-medium
                    text-slate-600
                    transition
                    hover:bg-slate-100
                  "
                >
                  <Eye size={15} />

                  View
                </Link>

                {/* Action buttons */}

                <div className="flex items-center gap-1">
                  {canTakeAction && (
                    <>
                      {/* Edit */}

                      <button
                        onClick={() => onEdit(quote)}
                        aria-label="Edit quote"
                        className="
                          rounded-lg
                          p-2
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                      >
                        <Edit size={16} />
                      </button>

                      {/* Approve */}

                      <button
                        onClick={() =>
                          onApprove(quote.id)
                        }
                        aria-label="Approve quote"
                        className="
                          rounded-lg
                          p-2
                          text-emerald-500
                          transition
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        <CheckCircle size={16} />
                      </button>

                      {/* Reject */}

                      <button
                        onClick={() =>
                          onReject(quote.id)
                        }
                        aria-label="Reject quote"
                        className="
                          rounded-lg
                          p-2
                          text-red-500
                          transition
                          hover:bg-red-50
                          hover:text-red-700
                        "
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}

                  {/* Delete */}

                  <button
                    onClick={() =>
                      onDelete(quote.id)
                    }
                    aria-label="Delete quote"
                    className="
                      rounded-lg
                      p-2
                      text-slate-400
                      transition
                      hover:bg-red-50
                      hover:text-red-600
                    "
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================
          DESKTOP / TABLET
      ================================= */}

      <div
        className="
          hidden
          overflow-x-auto
          rounded-2xl
          border
          border-slate-200
          bg-white
          md:block
        "
      >
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                className="
                  px-6
                  py-3
                  text-left
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Quote #
              </th>

              <th
                className="
                  px-6
                  py-3
                  text-left
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Customer
              </th>

              <th
                className="
                  px-6
                  py-3
                  text-left
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Total
              </th>

              <th
                className="
                  px-6
                  py-3
                  text-left
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Status
              </th>

              <th
                className="
                  px-6
                  py-3
                  text-left
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Created
              </th>

              <th
                className="
                  px-6
                  py-3
                  text-right
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {quotes.map((quote) => {
              const canTakeAction =
                quote.status === "DRAFT" ||
                quote.status === "SENT";

              return (
                <tr
                  key={quote.id}
                  className="
                    transition
                    hover:bg-slate-50
                  "
                >
                  {/* Quote */}

                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      to={`/quotes/${quote.id}`}
                      className="
                        font-medium
                        text-indigo-600
                        hover:underline
                      "
                    >
                      {quote.quoteNumber}
                    </Link>
                  </td>

                  {/* Customer */}

                  <td
                    className="
                      whitespace-nowrap
                      px-6
                      py-4
                      text-sm
                      text-slate-600
                    "
                  >
                    {quote.customer.name}
                  </td>

                  {/* Total */}

                  <td
                    className="
                      whitespace-nowrap
                      px-6
                      py-4
                      text-sm
                      font-medium
                      text-slate-900
                    "
                  >
                    {formatCurrency(quote.total)}
                  </td>

                  {/* Status */}

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${statusColor(quote.status)}
                      `}
                    >
                      {quote.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  {/* Created */}

                  <td
                    className="
                      whitespace-nowrap
                      px-6
                      py-4
                      text-sm
                      text-slate-600
                    "
                  >
                    {new Date(
                      quote.createdAt
                    ).toLocaleDateString()}
                  </td>

                  {/* Actions */}

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}

                      <Link
                        to={`/quotes/${quote.id}`}
                        aria-label="View quote"
                        className="
                          rounded-lg
                          p-2
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-slate-600
                        "
                      >
                        <Eye size={16} />
                      </Link>

                      {canTakeAction && (
                        <>
                          {/* Edit */}

                          <button
                            onClick={() =>
                              onEdit(quote)
                            }
                            aria-label="Edit quote"
                            className="
                              rounded-lg
                              p-2
                              text-slate-400
                              transition
                              hover:bg-slate-100
                              hover:text-slate-600
                            "
                          >
                            <Edit size={16} />
                          </button>

                          {/* Approve */}

                          <button
                            onClick={() =>
                              onApprove(
                                quote.id
                              )
                            }
                            aria-label="Approve quote"
                            className="
                              rounded-lg
                              p-2
                              text-emerald-500
                              transition
                              hover:bg-emerald-50
                              hover:text-emerald-700
                            "
                          >
                            <CheckCircle
                              size={16}
                            />
                          </button>

                          {/* Reject */}

                          <button
                            onClick={() =>
                              onReject(
                                quote.id
                              )
                            }
                            aria-label="Reject quote"
                            className="
                              rounded-lg
                              p-2
                              text-red-500
                              transition
                              hover:bg-red-50
                              hover:text-red-700
                            "
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}

                      {/* Delete */}

                      <button
                        onClick={() =>
                          onDelete(quote.id)
                        }
                        aria-label="Delete quote"
                        className="
                          rounded-lg
                          p-2
                          text-slate-400
                          transition
                          hover:bg-red-50
                          hover:text-red-600
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}