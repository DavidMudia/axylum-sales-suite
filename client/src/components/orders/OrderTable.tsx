import {
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import type { Order } from "../../api/order";
import { statusColor } from "../../utils/statusColor";
import { formatCurrency } from "../../utils/currency";

type Props = {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function OrderTable({
  orders,
  onEdit,
  onDelete,
  onApprove,
  onCancel,
}: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center sm:py-24">
        <ShoppingCart
          size={40}
          className="mx-auto mb-4 text-slate-300"
        />

        <p className="font-semibold text-slate-700">
          No orders found
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search or status filter.
        </p>
      </div>
    );
  }

  const canApproveCancel = (status: string) =>
    status !== "DELIVERED" &&
    status !== "CANCELLED";

  return (
    <>
      {/* ===================================================== */}
      {/* MOBILE */}
      {/* ===================================================== */}

      <div className="space-y-3 md:hidden">

        {orders.map((order) => {

          const canAct = canApproveCancel(
            order.status
          );

          return (
            <div
              key={order.id}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
              "
            >

              {/* Main clickable area */}

              <Link
                to={`/orders/${order.id}`}
                className="
                  block
                  p-4
                  transition
                  active:bg-slate-50
                "
              >

                {/* Top row */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Order
                    </p>

                    <h3 className="mt-1 truncate text-base font-bold text-indigo-600">
                      {order.orderNumber}
                    </h3>

                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      ${statusColor(order.status)}
                    `}
                  >
                    {order.status.replaceAll("_", " ")}
                  </span>

                </div>


                {/* Customer */}

                <div className="mt-4">

                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Customer
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                    {order.customer.name}
                  </p>

                </div>


                {/* Amount + date */}

                <div className="mt-4 flex items-end justify-between">

                  <div>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Created
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              </Link>


              {/* Actions */}

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">

                <Link
                  to={`/orders/${order.id}`}
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-indigo-600
                  "
                >
                  View order
                  <ChevronRight size={14} />
                </Link>


                <div className="flex items-center gap-1">

                  {canAct && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(order)
                        }
                        title="Edit order"
                        className="
                          rounded-lg
                          p-2
                          text-slate-500
                          transition
                          hover:bg-white
                          hover:text-slate-800
                        "
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onApprove(order.id)
                        }
                        title="Approve order"
                        className="
                          rounded-lg
                          p-2
                          text-emerald-500
                          transition
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        <CheckCircle size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onCancel(order.id)
                        }
                        title="Cancel order"
                        className="
                          rounded-lg
                          p-2
                          text-red-500
                          transition
                          hover:bg-red-50
                          hover:text-red-700
                        "
                      >
                        <XCircle size={17} />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(order.id)
                    }
                    title="Delete order"
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


      {/* ===================================================== */}
      {/* DESKTOP */}
      {/* ===================================================== */}

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">

        <table className="min-w-full divide-y divide-slate-200">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Order #
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
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


          <tbody className="divide-y divide-slate-100 bg-white">

            {orders.map((order) => {

              const canAct =
                canApproveCancel(order.status);

              return (
                <tr
                  key={order.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="whitespace-nowrap px-5 py-4">

                    <Link
                      to={`/orders/${order.id}`}
                      className="text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>

                  </td>


                  <td className="max-w-[240px] truncate whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {order.customer.name}
                  </td>


                  <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800">
                    {formatCurrency(order.total)}
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
                        ${statusColor(order.status)}
                      `}
                    >
                      {order.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                  </td>


                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>


                  <td className="whitespace-nowrap px-5 py-4">

                    <div className="flex items-center justify-end gap-1.5">

                      <Link
                        to={`/orders/${order.id}`}
                        title="View order"
                        className="
                          rounded-lg
                          p-2
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                      >
                        <Eye size={16} />
                      </Link>


                      {canAct && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(order)
                            }
                            title="Edit order"
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

                          <button
                            type="button"
                            onClick={() =>
                              onApprove(order.id)
                            }
                            title="Approve order"
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

                          <button
                            type="button"
                            onClick={() =>
                              onCancel(order.id)
                            }
                            title="Cancel order"
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


                      <button
                        type="button"
                        onClick={() =>
                          onDelete(order.id)
                        }
                        title="Delete order"
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