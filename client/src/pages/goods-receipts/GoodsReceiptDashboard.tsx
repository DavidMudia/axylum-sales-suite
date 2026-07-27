import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Plus,
  Search,
  Truck,
  CheckCircle2,
  PackageCheck,
  Warehouse,
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

    return dashboard.receipts.filter(
      (receipt) =>
        receipt.receiptNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        receipt.supplier.name       // ✅ fixed: access name property
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        receipt.purchaseOrder.purchaseOrderNumber
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [dashboard, search]);

  if (loading) {
    return (
      <div className="space-y-8 text-slate-800">
        <div className="h-44 rounded-3xl bg-slate-200 animate-pulse text-slate-800" />
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
        <div className="h-[500px] rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-3xl border bg-white p-12 text-center text-slate-800" >
        Failed to load goods receipts.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1700px] space-y-8 text-slate-800">
      {/* Hero */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Inventory Operations
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white">
              Goods Receipts
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Receive supplier deliveries, verify incoming inventory,
              and monitor warehouse stock inflow.
            </p>
          </div>
          <Can permission={PERMISSIONS.GOODS_RECEIPT.CREATE}>
            <Link
              to="/goods-receipts/create"
              className="inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-500"
            >
              <Plus size={20} />
              Receive Goods
            </Link>
          </Can>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 text-slate-800">
        <div className="rounded-2xl border bg-white p-6">
          <Truck className="mb-4 text-indigo-600" />
          <p className="text-sm text-slate-500">Total Receipts</p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.summary.totalReceipts}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <PackageCheck className="mb-4 text-emerald-600" />
          <p className="text-sm text-slate-500">Received</p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.summary.received}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 text-slate-800">
          <CheckCircle2 className="mb-4 text-blue-600" />
          <p className="text-sm text-slate-500">Verified</p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.summary.verified}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <Warehouse className="mb-4 text-orange-500" />
          <p className="text-sm text-slate-500">Cancelled</p>
          <h2 className="mt-2 text-3xl font-bold">
            {dashboard.summary.cancelled}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative text-slate-800">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search receipt number, supplier or purchase order..."
          className="w-full rounded-2xl border bg-white py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border bg-white text-slate-800">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-500">
              <th className="px-6 py-4">Receipt</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Purchase Order</th>
              <th className="px-6 py-4">Warehouse</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr
                key={receipt.id}
                className="border-t transition hover:bg-slate-50"
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
                <td className="px-6 py-5">
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}