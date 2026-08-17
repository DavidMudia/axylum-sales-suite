import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Plus,
  Search,
  Truck,
  CheckCircle2,
  PackageCheck,
  Warehouse,
  ChevronRight,
} from "lucide-react";

import {
  getDashboard,
  type GoodsReceiptDashboardResponse,
} from "../../api/goodsReceipt";

import Can from "../../components/auth/Can";
import { PERMISSIONS } from "../../constants/permissions";

export default function GoodsReceiptDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] =
    useState<GoodsReceiptDashboardResponse | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const receipts = useMemo(() => {
    if (!dashboard) return [];

    const query = search.trim().toLowerCase();

    if (!query) return dashboard.receipts;

    return dashboard.receipts.filter((receipt) =>
      [
        receipt.receiptNumber,
        receipt.supplier.name,
        receipt.purchaseOrder.purchaseOrderNumber,
        receipt.warehouse.name,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [dashboard, search]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1700px] space-y-5 text-slate-800 sm:space-y-6 lg:space-y-8">
        {/* Hero */}
        <div className="h-56 animate-pulse rounded-2xl bg-slate-200 sm:h-44 sm:rounded-3xl" />

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-slate-200 sm:h-32"
            />
          ))}
        </div>

        <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />

        <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200 sm:rounded-3xl" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-slate-800 sm:p-12">
        Failed to load goods receipts.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1700px] space-y-5 text-slate-800 sm:space-y-6 lg:space-y-8">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:rounded-3xl">
        <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400 sm:text-sm sm:tracking-[0.25em]">
              Inventory Operations
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Goods Receipts
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base">
              Receive supplier deliveries, verify incoming inventory,
              and monitor warehouse stock inflow.
            </p>
          </div>

          <Can permission={PERMISSIONS.GOODS_RECEIPT.CREATE}>
            <Link
              to="/goods-receipts/create"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-indigo-500
                sm:w-auto
                sm:rounded-2xl
                sm:px-6
                sm:py-4
                sm:text-base
              "
            >
              <Plus size={19} />
              Receive Goods
            </Link>
          </Can>

        </div>
      </section>


      {/* ========================================================= */}
      {/* SUMMARY CARDS */}
      {/* ========================================================= */}

      <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">

        {/* Total */}
        <SummaryCard
          icon={<Truck size={19} />}
          iconClass="bg-indigo-50 text-indigo-600"
          label="Total Receipts"
          value={dashboard.summary.totalReceipts}
        />

        {/* Received */}
        <SummaryCard
          icon={<PackageCheck size={19} />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Received"
          value={dashboard.summary.received}
        />

        {/* Verified */}
        <SummaryCard
          icon={<CheckCircle2 size={19} />}
          iconClass="bg-blue-50 text-blue-600"
          label="Verified"
          value={dashboard.summary.verified}
        />

        {/* Cancelled */}
        <SummaryCard
          icon={<Warehouse size={19} />}
          iconClass="bg-orange-50 text-orange-500"
          label="Cancelled"
          value={dashboard.summary.cancelled}
        />

      </section>


      {/* ========================================================= */}
      {/* SEARCH */}
      {/* ========================================================= */}

      <section className="relative">
        <Search
          size={18}
          className="
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-slate-400
            sm:left-4
          "
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search receipts, suppliers or orders..."
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            py-3
            pl-10
            pr-4
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100
            sm:rounded-2xl
            sm:py-3.5
            sm:pl-11
          "
        />
      </section>


      {/* ========================================================= */}
      {/* MOBILE RECEIPT CARDS */}
      {/* ========================================================= */}

      <section className="space-y-3 md:hidden">

        {receipts.length === 0 && (
          <EmptyState />
        )}

        {receipts.map((receipt) => (
          <Link
            key={receipt.id}
            to={`/goods-receipts/${receipt.id}`}
            className="
              block
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              transition
              active:scale-[0.99]
              hover:border-indigo-200
              hover:shadow-sm
            "
          >

            {/* Top */}
            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Receipt
                </p>

                <p className="mt-1 truncate text-base font-bold text-indigo-600">
                  {receipt.receiptNumber}
                </p>

              </div>

              <span
                className="
                  shrink-0
                  rounded-full
                  bg-emerald-100
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-emerald-700
                "
              >
                {receipt.status}
              </span>

            </div>


            {/* Details */}
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">

              <ReceiptDetail
                label="Supplier"
                value={receipt.supplier.name}
              />

              <ReceiptDetail
                label="Purchase Order"
                value={receipt.purchaseOrder.purchaseOrderNumber}
              />

              <ReceiptDetail
                label="Warehouse"
                value={receipt.warehouse.name}
              />

            </div>


            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

              <span className="text-xs text-slate-500">
                {new Date(
                  receipt.createdAt
                ).toLocaleDateString()}
              </span>

              <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                View receipt
                <ChevronRight size={15} />
              </span>

            </div>

          </Link>
        ))}

      </section>


      {/* ========================================================= */}
      {/* DESKTOP TABLE */}
      {/* ========================================================= */}

      <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white md:block">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-50">

              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                <th className="px-6 py-4">
                  Receipt
                </th>

                <th className="px-6 py-4">
                  Supplier
                </th>

                <th className="px-6 py-4">
                  Purchase Order
                </th>

                <th className="px-6 py-4">
                  Warehouse
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {receipts.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState />
                  </td>
                </tr>
              )}

              {receipts.map((receipt) => (

                <tr
                  key={receipt.id}
                  className="
                    border-t
                    border-slate-100
                    transition
                    hover:bg-slate-50
                  "
                >

                  <td className="px-6 py-5 font-semibold">

                    <Link
                      to={`/goods-receipts/${receipt.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {receipt.receiptNumber}
                    </Link>

                  </td>

                  <td className="px-6 py-5">
                    {receipt.supplier.name}
                  </td>

                  <td className="px-6 py-5">
                    {receipt.purchaseOrder.purchaseOrderNumber}
                  </td>

                  <td className="px-6 py-5">
                    {receipt.warehouse.name}
                  </td>

                  <td className="px-6 py-5">

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {receipt.status}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {new Date(
                      receipt.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}


/* ============================================================= */
/* SUMMARY CARD */
/* ============================================================= */

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        sm:p-5
        lg:p-6
      "
    >

      <div
        className={`
          mb-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          sm:mb-4
          sm:h-10
          sm:w-10
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <p className="text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </p>

      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
        {value.toLocaleString()}
      </h2>

    </div>
  );
}


/* ============================================================= */
/* RECEIPT DETAIL */
/* ============================================================= */

function ReceiptDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="shrink-0 text-xs text-slate-400">
        {label}
      </span>

      <span className="truncate text-right text-sm font-medium text-slate-700">
        {value}
      </span>

    </div>
  );
}


/* ============================================================= */
/* EMPTY STATE */
/* ============================================================= */

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">

      <PackageCheck
        size={38}
        className="mx-auto mb-3 text-slate-300"
      />

      <p className="font-semibold text-slate-700">
        No goods receipts found
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Try adjusting your search.
      </p>

    </div>
  );
}