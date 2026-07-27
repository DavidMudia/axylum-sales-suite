import {
  Bell,
  Menu,
  Moon,
  Search,
  Settings,
} from "lucide-react";

type Props = {
  onMenuClick: () => void;
};

export default function Navbar({
  onMenuClick,
}: Props) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/70 bg-white/90 backdrop-blur">

      <div className="flex h-full items-center justify-between px-6">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>

            <h1 className="text-lg font-semibold text-slate-900">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Business Overview
            </p>

          </div>

        </div>

        {/* Center */}

        <div className="hidden w-full max-w-md lg:block">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              placeholder="Search customers, invoices, products..."
              className="w-full rounded-xl border border-slate-200/70 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2">

          <button className="rounded-xl p-2 hover:bg-slate-100">

            <Moon size={19} />

          </button>

          <button className="relative rounded-xl p-2 hover:bg-slate-100">

            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

          </button>

          <button className="rounded-xl p-2 hover:bg-slate-100">

            <Settings size={19} />

          </button>

          <div className="ml-3 flex items-center gap-3 rounded-xl border border-slate-200/70 px-3 py-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">

              M

            </div>

            <div className="hidden text-left lg:block">

              <p className="text-sm font-semibold">

                Mudia

              </p>

              <p className="text-xs text-slate-500">

                Administrator

              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}