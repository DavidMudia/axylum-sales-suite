import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  PackageCheck,
  Truck,
  Warehouse,
} from "lucide-react";

import { Link } from "react-router-dom";

import type { GoodsReceiptCard as GoodsReceipt } from "../../../api/goodsReceipt";

type Props = {
  receipt: GoodsReceipt;
};

function statusStyles(status: string) {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-100 text-emerald-700";

    case "RECEIVED":
      return "bg-blue-100 text-blue-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
}

function StatusIcon(status: string) {
  switch (status) {
    case "VERIFIED":
      return (
        <CheckCircle2
          size={16}
          className="text-emerald-600"
        />
      );

    case "RECEIVED":
      return (
        <PackageCheck
          size={16}
          className="text-blue-600"
        />
      );

    default:
      return (
        <Clock3
          size={16}
          className="text-amber-600"
        />
      );
  }
}

export default function GoodsReceiptCard({
  receipt,
}: Props) {
  return (
    <Link
      to={`/goods-receipts/${receipt.id}`}
      className="
        group
        block
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-7
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-xl
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
            Goods Receipt
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {receipt.receiptNumber}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {receipt.createdAt}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${statusStyles(
            receipt.status
          )}`}
        >
          {StatusIcon(receipt.status)}
          {receipt.status}
        </span>
      </div>

      {/* Supplier */}

      <div className="mt-7 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3">
          <Truck
            size={18}
            className="text-indigo-600"
          />
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Supplier
          </p>

          <p className="font-semibold text-slate-800">
            {receipt.supplier.name}
          </p>
        </div>
      </div>

      {/* Warehouse */}

      <div className="mt-5 flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-3">
          <Warehouse
            size={18}
            className="text-slate-700"
          />
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Warehouse
          </p>

          <p className="font-semibold text-slate-800">
            {receipt.warehouse.name}
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="mt-7 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Purchase Order
          </p>

          <p className="mt-2 font-semibold text-slate-800">
            {receipt.purchaseOrder.purchaseOrderNumber}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Received
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {receipt.totalReceivedItems}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Rejected
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {receipt.totalRejectedItems}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <FileText
              size={16}
              className="text-slate-500"
            />

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Invoice
            </p>
          </div>

          <p className="mt-2 truncate font-semibold text-slate-800">
            {receipt.supplierInvoiceNumber ??
              "Not Provided"}
          </p>
        </div>
      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
        <div>
          <p className="text-xs text-slate-400">
            Received By
          </p>

          <p className="font-semibold text-slate-800">
            {receipt.receivedBy.firstName}{" "}
{receipt.receivedBy.lastName}
          </p>
        </div>

        <span className="flex items-center gap-2 font-semibold text-indigo-600 transition group-hover:translate-x-1">
          View Receipt

          <ArrowRight size={18} />
        </span>
      </div>
    </Link>
  );
}
