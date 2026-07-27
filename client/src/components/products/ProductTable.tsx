// src/components/products/ProductTable.tsx
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";

type Product = {
  id: number;
  name: string;
  sku?: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  sellingPrice: number;
};

type Props = {
  products?: Product[];
};

export default function ProductTable({ products = [] }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 text-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Product Catalogue</h2>
          <p className="mt-1 text-sm text-slate-500">All products currently available.</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block text-slate-800">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Min Stock</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-500">No products found.</td>
              </tr>
            )}
            {products.map((product) => {
              const isLowStock = product.currentStock < product.minimumStock;
              const status =
                product.currentStock <= 0
                  ? "Out of Stock"
                  : isLowStock
                  ? "Low Stock"
                  : "In Stock";

              return (
                <tr key={product.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <Link to={`/products/${product.id}`} className="flex items-center gap-4 hover:underline">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                        <Package size={22} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.sku || "No SKU"}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 font-medium">{product.currentStock} {product.unit}</td>
                  <td className="px-4 font-medium">{product.minimumStock}</td>
                  <td className="px-4 font-semibold">₦{Number(product.sellingPrice).toLocaleString()}</td>
                  <td className="px-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        status === "In Stock"
                          ? "bg-emerald-100 text-emerald-700"
                          : status === "Low Stock"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 lg:hidden">
        {products.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">No products found.</div>
        )}
        {products.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <Package size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.sku}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <Info label="Stock" value={`${product.currentStock} ${product.unit}`} />
              <Info label="Min Stock" value={`${product.minimumStock}`} />
              <Info label="Price" value={`₦${Number(product.sellingPrice).toLocaleString()}`} />
              <Info label="Status" value={product.currentStock < product.minimumStock ? "Low Stock" : product.currentStock <= 0 ? "Out of Stock" : "In Stock"} />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}