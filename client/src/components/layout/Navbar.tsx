import {
  Bell,
  Menu,
  Moon,
  Search,
  Settings,
  CalendarDays,
} from "lucide-react";

type Props = {
  onMenuClick: () => void;
};

export default function Navbar({
  onMenuClick,
}: Props) {
  const today = new Date();

  const date = today.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur">

      <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">

        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
              lg:hidden
            "
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                Dashboard
              </h1>

              {/* Date — same row on mobile */}
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-slate-100
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-slate-600
                  sm:px-2.5
                "
              >
                <CalendarDays
                  size={13}
                  className="text-slate-500"
                />

                <span className="hidden xs:inline">
                  {date}
                </span>

                <span className="xs:hidden">
                  {today.toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

            </div>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Business Overview
            </p>

          </div>

        </div>


        {/* CENTER SEARCH */}
        <div className="hidden w-full max-w-md lg:block">

          <div className="relative">

            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              placeholder="Search customers, invoices, products..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-11
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-500/10
              "
            />

          </div>

        </div>


        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">

          {/* Mobile search */}
          <button
            aria-label="Search"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
              lg:hidden
            "
          >
            <Search size={18} />
          </button>


          {/* Theme */}
          <button
            aria-label="Toggle theme"
            className="
              hidden
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
              sm:flex
            "
          >
            <Moon size={18} />
          </button>


          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            <Bell size={18} />

            <span
              className="
                absolute
                right-1.5
                top-1.5
                h-2
                w-2
                rounded-full
                bg-red-500
                ring-2
                ring-white
              "
            />
          </button>


          {/* Settings */}
          <button
            aria-label="Settings"
            className="
              hidden
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
              md:flex
            "
          >
            <Settings size={18} />
          </button>


          {/* Profile */}
          <button
            className="
              ml-1
              flex
              items-center
              rounded-xl
              p-1
              transition
              hover:bg-slate-100
              sm:ml-2
              sm:border
              sm:border-slate-200/70
              sm:px-2
              sm:py-1.5
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-sm
                font-semibold
                text-white
                sm:h-9
                sm:w-9
              "
            >
              M
            </div>

            <div className="ml-2 hidden text-left lg:block">

              <p className="text-sm font-semibold text-slate-900">
                Mudia
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

          </button>

        </div>

      </div>

    </header>
  );
}