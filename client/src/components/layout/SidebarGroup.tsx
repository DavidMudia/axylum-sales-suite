import { useState } from "react";

import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  icon: any;
  children: React.ReactNode;
}

export default function SidebarGroup({
  title,
  icon: Icon,
  children,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div>

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800"
      >
        <div className="flex items-center gap-3">

          <Icon size={20} />

          <span>{title}</span>

        </div>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-2 space-y-2 pl-4">

          {children}

        </div>
      )}

    </div>
  );
}