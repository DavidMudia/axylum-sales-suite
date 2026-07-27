// src/pages/ProductDetails.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct, useUpdateProduct, useDeleteProduct } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import  PageHeader  from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import ProductDrawer from "../components/products/ProductDrawer";
import { formatCurrency } from "../utils/currency";
import { ArrowLeft, Pencil } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: product, isLoading, refetch } = useProduct(Number(id));
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleEdit = () => {
    setDrawerOpen(true);
  };

  const handleUpdate = async (formData: any) => {
    if (!product) return;
    await updateMutation.mutateAsync({ id: product.id, data: formData });
    setDrawerOpen(false);
    refetch(); // refresh product data
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteMutation.mutateAsync(product.id);
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return <div className="rounded-2xl border bg-white p-12 text-center text-slate-900">Product not found.</div>;
  }

  const isLowStock = product.currentStock < product.minimumStock;
  const status =
    product.currentStock <= 0
      ? "Out of Stock"
      : isLowStock
      ? "Low Stock"
      : "In Stock";

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/products")} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <PageHeader title={product.name} subtitle={product.sku || "No SKU"} />
        </div>
        <div className="flex items-center gap-3">
          {hasPermission("inventory.update") && (
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Pencil size={18} className="mr-2" /> Edit
            </Button>
          )}
          {hasPermission("inventory.delete") && (
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          )}
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              status === "In Stock"
                ? "bg-emerald-100 text-emerald-700"
                : status === "Low Stock"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 text-slate-900">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Product Details</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">SKU</dt>
              <dd className="font-medium">{product.sku || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Barcode</dt>
              <dd className="font-medium">{product.barcode || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Unit</dt>
              <dd className="font-medium">{product.unit}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Description</dt>
              <dd className="font-medium">{product.description || "—"}</dd>
            </div>
            {product.imageUrl && (
              <div className="flex justify-center">
                <img src={product.imageUrl} alt={product.name} className="h-48 w-48 rounded-xl object-cover" />
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500">Financial & Inventory</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Cost Price</dt>
              <dd className="font-medium">{formatCurrency(product.costPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Selling Price</dt>
              <dd className="font-medium">{formatCurrency(product.sellingPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Current Stock</dt>
              <dd className="font-medium">{product.currentStock} {product.unit}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Minimum Stock</dt>
              <dd className="font-medium">{product.minimumStock}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium">{status}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Edit Drawer */}
      <ProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialData={product}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}