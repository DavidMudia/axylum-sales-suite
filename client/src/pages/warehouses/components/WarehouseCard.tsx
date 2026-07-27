import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  AlertTriangle,
  PackageX,
  User,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

import { formatCurrency } from "../../../utils/currency";
import { statusColor } from "../../../utils/statusColor";

import type { WarehouseCard as Warehouse } from "../../../api/warehouse";

type Props = {
  warehouse: Warehouse;
};

export default function WarehouseCard({ warehouse }: Props) {
  return (
    <Link
      to={`/warehouses/${warehouse.id}`}
      className="
        group
        block
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-6                    // ✅ added consistent padding
        transition-all
        duration-300
        hover:border-indigo-500
        hover:shadow-[0_20px_60px_rgba(79,70,229,.25)]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">   {/* ✅ text-white for dark bg */}
              {warehouse.name}
            </h2>
            {warehouse.isPrimary && (
              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            )}
          </div>
          <p className="mt-1 text-sm text-slate-400">   {/* ✅ lighter text for dark bg */}
            {warehouse.code}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
            warehouse.status
          )}`}
        >
          {warehouse.status}
        </span>
      </div>

      {/* Manager */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
          <User size={18} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Manager</p>
          <p className="font-medium text-white">
            {warehouse.managerName ?? "Not Assigned"}
          </p>
        </div>
      </div>

      {/* Inventory Value */}
      <div className="mt-6 rounded-xl bg-slate-800/50 p-4">   {/* ✅ subtle background */}
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Inventory Value
        </p>
        <h3 className="mt-1 text-2xl font-bold text-white">
          {formatCurrency(warehouse.inventoryValue)}
        </h3>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-white">
        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4 text-white">  {/* ✅ p-4 instead of p-3 */}
          <Boxes size={18} className="mb-2 text-blue-400" />  {/* ✅ lighter icon for dark bg */}
          <p className="text-xs text-white">Products</p>
          <h4 className="text-xl font-bold text-white">{warehouse.products}</h4>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
          <ClipboardCheck size={18} className="mb-2 text-green-400" />
          <p className="text-xs text-slate-400">Goods Receipts</p>
          <h4 className="text-xl font-bold text-white">{warehouse.goodsReceipts}</h4>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
          <AlertTriangle size={18} className="mb-2 text-orange-400" />
          <p className="text-xs text-slate-400">Low Stock</p>
          <h4 className="text-xl font-bold text-white">{warehouse.lowStock}</h4>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
          <PackageX size={18} className="mb-2 text-red-400" />
          <p className="text-xs text-slate-400">Out of Stock</p>
          <h4 className="text-xl font-bold text-white">{warehouse.outOfStock}</h4>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-sm text-slate-400">
          Purchase Orders
          <span className="ml-2 font-semibold text-white">
            {warehouse.purchaseOrders}
          </span>
        </span>

        <span className="flex items-center gap-2 font-semibold text-indigo-400 transition-all group-hover:translate-x-1">
          View Warehouse
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}