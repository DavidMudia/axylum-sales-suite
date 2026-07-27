import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ClipboardCheck,
  Warehouse,
  Truck,
  Calendar,
} from "lucide-react";

import {
  getGoodsReceipt,
  type GoodsReceiptDetails,
} from "../../api/goodsReceipt";

export default function GoodsReceiptDetailsPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [receipt, setReceipt] =
    useState<GoodsReceiptDetails | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;

        const data = await getGoodsReceipt(Number(id));

        setReceipt(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 text-slate-900">

        <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />

        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>

        <div className="h-[450px] rounded-3xl bg-slate-200 animate-pulse" />

      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-slate-900">
        Goods receipt not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1700px] space-y-8">

      {/* Back */}

      <Link
        to="/goods-receipts"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={18} />

        Back to Goods Receipts
      </Link>

      {/* Hero */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Goods Receipt
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              {receipt.receiptNumber}
            </h1>

            <p className="mt-3 text-slate-400">
              Supplier:{" "}
              <span className="text-white">
                {receipt.supplier.name}
              </span>
            </p>

          </div>

          <div className="flex items-start text-slate-900">

            <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">
              {receipt.status}
            </span>

          </div>

        </div>

      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 text-slate-900">

        <div className="rounded-2xl border bg-white p-6 text-slate-900">

          <ClipboardCheck className="mb-4 text-indigo-600" />

          <p className="text-sm text-slate-500">
            Items Received
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {receipt.totalReceivedItems}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <Warehouse className="mb-4 text-blue-600" />

          <p className="text-sm text-slate-500">
            Warehouse
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            {receipt.warehouse.name}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <Truck className="mb-4 text-orange-500" />

          <p className="text-sm text-slate-500">
            Truck Number
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            {receipt.truckNumber || "-"}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <Calendar className="mb-4 text-emerald-600" />

          <p className="text-sm text-slate-500">
            Date Received
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            {new Date(
              receipt.createdAt
            ).toLocaleDateString()}
          </h2>

        </div>

      </div>

      {/* Information */}

      <div className="grid gap-6 lg:grid-cols-2 text-slate-900">

        {/* Receipt */}

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-xl font-bold">
            Receipt Information
          </h2>

          <div className="space-y-5">

            <Info
              label="Purchase Order"
              value={receipt.purchaseOrder.purchaseOrderNumber}
            />

            <Info
              label="Supplier Invoice"
              value={
                receipt.supplierInvoiceNumber || "-"
              }
            />

            <Info
              label="Delivery Note"
              value={
                receipt.supplierDeliveryNote || "-"
              }
            />

            <Info
              label="Remarks"
              value={receipt.remarks || "-"}
            />

          </div>

        </div>

        {/* Personnel */}

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-xl font-bold">
            Personnel
          </h2>

          <div className="space-y-5">

            <Info
              label="Received By"
              value={`${receipt.receivedBy.firstName} ${receipt.receivedBy.lastName}`}
            />

            <Info
              label="Verified By"
              value={
                receipt.verifiedBy
                  ? `${receipt.verifiedBy.firstName} ${receipt.verifiedBy.lastName}`
                  : "Not Verified"
              }
            />

            <Info
              label="Driver"
              value={receipt.driverName || "-"}
            />

          </div>

        </div>

      </div>

      {/* Items */}

      <div className="overflow-hidden rounded-3xl border bg-white text-slate-900">

        <div className="border-b px-8 py-6">

          <h2 className="text-xl font-bold">
            Received Items
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Product
              </th>

              <th className="px-6 py-4 text-right">
                Ordered
              </th>

              <th className="px-6 py-4 text-right">
                Received
              </th>

              <th className="px-6 py-4 text-right">
                Rejected
              </th>

              <th className="px-6 py-4 text-right">
                Accepted
              </th>

              <th className="px-6 py-4 text-right">
                Unit Cost
              </th>

            </tr>

          </thead>

          <tbody>

            {receipt.items.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-6 py-5 font-medium">
                  {item.product.name}
                </td>

                <td className="px-6 py-5 text-right">
                  {item.orderedQuantity}
                </td>

                <td className="px-6 py-5 text-right">
                  {item.receivedQuantity}
                </td>

                <td className="px-6 py-5 text-right text-red-600">
                  {item.rejectedQuantity}
                </td>

                <td className="px-6 py-5 text-right text-emerald-600">
                  {item.acceptedQuantity}
                </td>

                <td className="px-6 py-5 text-right">
                  ₦{item.unitCost.toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}