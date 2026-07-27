import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";

import {
  getWarehouse,
} from "../../api/warehouse";

export default function WarehouseDetails() {
  const { id } = useParams();

  const [warehouse, setWarehouse] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        const data =
          await getWarehouse(
            Number(id)
          );

        setWarehouse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="h-10 w-72 animate-pulse rounded bg-slate-200" />

        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-200"
              />
            )
          )}
        </div>

      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        Warehouse not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-900">

      {/* Hero */}

      <div className="rounded-3xl bg-slate-900 p-8">

        <Link
          to="/warehouses"
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
        >
          <ArrowLeft size={18} />

          Back to Warehouses
        </Link>

        <h1 className="mt-5 text-4xl font-bold text-white">
          {warehouse.name}
        </h1>

        <p className="mt-2 text-slate-400">
          {warehouse.city}, {warehouse.state}
        </p>

      </div>

    </div>
  );
}