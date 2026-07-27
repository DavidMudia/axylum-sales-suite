import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../api/warehouse";
import type { WarehouseDashboardResponse } from "../../api/warehouse";

import WarehouseStats from "./components/WarehouseStats";
import WarehouseGrid from "./components/WarehouseGrid";

import Can from "../../components/auth/Can";
import { PERMISSIONS } from "../../constants/permissions";

export default function WarehouseDashboard() {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] =
    useState<WarehouseDashboardResponse | null>(
      null
    );

  const [search, setSearch] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);

      const data =
        await getDashboard();

      setDashboard(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const warehouses = useMemo(() => {
    if (!dashboard) return [];

    return dashboard.warehouses.filter(
      (warehouse) =>
        warehouse.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        warehouse.code
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
  }, [dashboard, search]);

  if (loading) {
    return (
      <div className="space-y-6 text-slate-900">
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />

        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[340px] animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Failed to load warehouse dashboard.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1700px] space-y-8 px-6 pb-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 lg:flex-row lg:items-center">

    <div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
            Warehouse Operations
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
            Warehouse Command Center
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
            Monitor inventory movement, warehouse utilization,
            goods receipts and operational performance
            across every warehouse.
        </p>

    </div>

    <Can permission={PERMISSIONS.WAREHOUSE.CREATE}>

        <button
    onClick={() => navigate("/warehouses/new")}
    className="
        inline-flex
        items-center
        gap-3
        rounded-2xl
        bg-indigo-600
        px-6
        py-4
        font-semibold
        text-white
        transition
        hover:bg-indigo-500
    "
>
    <Plus size={20} />
    Create Warehouse
</button>

    </Can>

</div>

      <WarehouseStats
        summary={dashboard.summary}
      />

      {/* Search */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search warehouse..."
          className="
w-full
rounded-2xl
border
border-slate-700
bg-slate-900
py-4
pl-12
pr-5
text-white
placeholder:text-slate-500
outline-none
transition
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-500/20
"
        />

      </div>

      <WarehouseGrid
        warehouses={warehouses}
      />

    </div>
  );
}