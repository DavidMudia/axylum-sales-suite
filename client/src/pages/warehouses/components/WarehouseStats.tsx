import {
  Warehouse,
  Boxes,
  ClipboardCheck,
  Truck,
} from "lucide-react";

import { formatCurrency } from "../../../utils/currency";

type Props = {
  summary: {
    totalWarehouses: number;
    activeWarehouses: number;
    inventoryRecords: number;
    inventoryValue: number;
    goodsReceipts: number;
    purchaseOrders: number;
  };
};

const stats = [
  {
    key: "totalWarehouses",
    title: "Warehouses",
    icon: Warehouse,
  },
  {
    key: "activeWarehouses",
    title: "Active",
    icon: Warehouse,
  },
  {
    key: "inventoryRecords",
    title: "Inventory",
    icon: Boxes,
  },
  {
    key: "goodsReceipts",
    title: "Goods Receipts",
    icon: Truck,
  },
  {
    key: "purchaseOrders",
    title: "Purchase Orders",
    icon: ClipboardCheck,
  },
];

export default function WarehouseStats({
  summary,
}: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5 text-slate-800">
      {stats.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-2xl border bg-white p-5 shadow-sm text-slate-800 "
          >
            <div className="flex items-center justify-between">
              <Icon
                size={22}
                className="text-indigo-600"
              />

              <span className="text-xs uppercase text-slate-400">
                {card.title}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {
                summary[
                  card.key as keyof typeof summary
                ]
              }
            </h2>
          </div>
        );
      })}

      <div className="rounded-2xl border bg-gradient-to-r from-indigo-600 to-blue-700 p-5 text-white xl:col-span-5">
        <p className="text-sm opacity-80">
          Total Inventory Value
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {formatCurrency(summary.inventoryValue)}
        </h1>
      </div>
    </div>
  );
}