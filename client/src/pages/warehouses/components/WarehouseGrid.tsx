import type { WarehouseCard as Warehouse } from "../../../api/warehouse";
import WarehouseCard from "./WarehouseCard";

type Props = {
  warehouses: Warehouse[];
};

export default function WarehouseGrid({
  warehouses,
}: Props) {
  if (warehouses.length === 0) {
    return (
        
      <div
  className="
    rounded-3xl
    border
    border-dashed
    border-slate-700
    bg-slate-900
    px-10
    py-20
    text-center
  "
>
        <h3 className="text-2xl font-bold text-white">
    No Warehouses Yet
</h3>

        <p className="mt-2 text-slate-500">
          Create your first warehouse to begin managing inventory.
        </p>
      </div>
    );
  }

  return (
    
    <div
      className="
        grid
        gap-6
        sm:grid-cols-1
        lg:grid-cols-2
        2xl:grid-cols-3
      "
    >
      {warehouses.map((warehouse) => (
        <WarehouseCard
          key={warehouse.id}
          warehouse={warehouse}
        />
      ))}
    </div>
  );
}