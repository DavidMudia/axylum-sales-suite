import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Users, label: "Customers", to: "/customers" },
  { icon: Package, label: "Products", to: "/products" },
  { icon: FileText, label: "Quotes", to: "/quotes" },
  { icon: Receipt, label: "Invoices", to: "/invoices" },
  { icon: BarChart3, label: "Reports", to: "/reports" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  open,
  onClose,
}: Props) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
fixed top-0 left-0 z-50
h-screen w-64 bg-zinc-900 text-white p-6
transition-transform duration-300

${open ? "translate-x-0" : "-translate-x-full"}

md:translate-x-0
md:static
md:z-auto
`}
      >
        <div className="mb-10 flex items-center justify-between">

          <h1 className="text-2xl font-bold">
            Axylum
          </h1>

          <button
            onClick={onClose}
            className="md:hidden"
          >
            <X />
          </button>

        </div>

        <nav className="space-y-2">

          {links.map((item) => (

            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-zinc-800"
                }`
              }
            >
              <item.icon size={20} />

              {item.label}

            </NavLink>

          ))}

        </nav>

      </aside>
    </>
  );
}