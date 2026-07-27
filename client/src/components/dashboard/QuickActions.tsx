// src/components/dashboard/QuickActions.tsx
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  ShoppingCart,
  UserPlus,
  Truck,
  ArrowRight,
} from "lucide-react";

import Card from "../ui/Card";

const actions = [
  {
    title: "New Invoice",
    subtitle: "Create customer invoice",
    icon: FilePlus,
    color: "bg-emerald-50 text-emerald-700",
    path: "/invoices",
  },
  {
    title: "New Customer",
    subtitle: "Add customer record",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-700",
    path: "/customers",
  },
  {
    title: "Sales Order",
    subtitle: "Create new order",
    icon: ShoppingCart,
    color: "bg-violet-50 text-violet-700",
    path: "/orders",
  },
  {
    title: "Waybill",
    subtitle: "Prepare delivery",
    icon: Truck,
    color: "bg-amber-50 text-amber-700",
    path: "/waybills", // adjust if you have a different route
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">

      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Quick Actions
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Frequently used operations
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    ${action.color}
                  `}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {action.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {action.subtitle}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="
                  text-slate-300
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-blue-600
                "
              />
            </button>
          );
        })}
      </div>

    </Card>
  );
}