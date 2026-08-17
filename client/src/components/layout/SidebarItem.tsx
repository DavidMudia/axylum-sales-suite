import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  path: string;
  collapsed: boolean;
  onNavigate: () => void;
};

export default function SidebarItem({
  icon: Icon,
  title,
  path,
  collapsed,
  onNavigate,
}: Props) {
  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `
        group
        flex
        items-center
        gap-3
        rounded-lg
        px-4
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200

        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
      `
      }
    >
      <Icon
        size={18}
        className="shrink-0"
      />

      {!collapsed && (
        <span className="truncate">
          {title}
        </span>
      )}
    </NavLink>
  );
}