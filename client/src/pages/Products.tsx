import DashboardLayout from "../layouts/DashboardLayout";
import KPI from "../components/dashboard/KPI";
import ProductTable from "../components/products/ProductTable";

import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { useProductStats } from "../hooks/useProducts";

export default function Products() {
  const { data, isLoading } = useProductStats();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Products"
            value={data?.totalProducts ?? 0}
            icon={<Package />}
          />

          <KPI
            title="In Stock"
            value={data?.inStock ?? 0}
            icon={<Boxes />}
          />

          <KPI
            title="Low Stock"
            value={data?.lowStock ?? 0}
            icon={<AlertTriangle />}
          />

          <KPI
            title="Out of Stock"
            value={data?.outOfStock ?? 0}
            icon={<XCircle />}
          />

        </div>

        <ProductTable />

      </div>
    </DashboardLayout>
  );
}