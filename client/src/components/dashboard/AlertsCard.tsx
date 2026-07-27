// src/components/dashboard/AlertsCard.tsx
import { useNavigate, Link } from 'react-router-dom';
import Card from "../ui/Card";
import {
  AlertTriangle,
  ClipboardList,
  RotateCcw,
  Truck,
  ChevronRight,
} from "lucide-react";

type Props = {
  alerts: {
    lowStock: number;
    pendingPurchaseOrders: number;
    pendingRefunds: number;
    pendingWaybills: number;
  };
  lowStockProducts: {
    id: number;
    name: string;
    quantity: number;
    minimumStock: number;
  }[];
};

export default function AlertsCard({
  alerts,
  lowStockProducts,
}: Props) {
  const navigate = useNavigate();

  const alertTiles = [
    {
      title: "Low Stock",
      value: alerts.lowStock,
      icon: AlertTriangle,
      color: "red" as const,
      path: "/products?stock=low",
    },
    {
      title: "Purchase Orders",
      value: alerts.pendingPurchaseOrders,
      icon: ClipboardList,
      color: "amber" as const,
      path: "/purchase-orders?status=PENDING_APPROVAL",
    },
    {
      title: "Refund Requests",
      value: alerts.pendingRefunds,
      icon: RotateCcw,
      color: "blue" as const,
      path: "/refunds?status=PENDING",
    },
    {
      title: "Pending Waybills",
      value: alerts.pendingWaybills,
      icon: Truck,
      color: "emerald" as const,
      path: "/waybills?status=PENDING",
    },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200/70 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Operations Center
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Items requiring immediate attention
        </p>
      </div>

      <div className="space-y-4 p-6">
        {alertTiles.map((tile) => (
          <AlertTile
            key={tile.title}
            icon={tile.icon}
            color={tile.color}
            title={tile.title}
            value={tile.value}
            onClick={() => navigate(tile.path)}
          />
        ))}
      </div>

      {/* Critical Stock */}
      <div className="border-t border-slate-200/70 px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            Critical Inventory
          </h3>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="space-y-4">
          {lowStockProducts.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
              <p className="text-sm text-slate-500">
                Inventory levels are healthy.
              </p>
            </div>
          )}

          {lowStockProducts.slice(0, 4).map((product) => {
            const percentage = Math.min(
              (product.quantity / product.minimumStock) * 100,
              100
            );

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="block rounded-xl border border-slate-200/70 p-4 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    {product.name}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {product.quantity} / {product.minimumStock}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

type TileProps = {
  icon: any;
  title: string;
  value: number;
  color: "red" | "amber" | "blue" | "emerald";
  onClick: () => void;
};

function AlertTile({ icon: Icon, title, value, color, onClick }: TileProps) {
  const styles = {
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      badge: "bg-red-100 text-red-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
  }[color];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-xl border border-slate-200/70 p-4 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${styles.bg}`}>
          <Icon size={20} className={styles.icon} />
        </div>
        <div>
          <p className="font-medium text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">Requires attention</p>
        </div>
      </div>
      <div className={`rounded-full px-3 py-1 text-sm font-semibold ${styles.badge}`}>
        {value}
      </div>
    </button>
  );
}