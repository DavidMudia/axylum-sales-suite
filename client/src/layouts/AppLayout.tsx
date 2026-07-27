import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100" >

      <Sidebar
        open={mobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className={`
          min-h-screen
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:ml-20"
              : "lg:ml-72"
          }
        `}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="min-w-0 p-4 md:p-6 xl:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}