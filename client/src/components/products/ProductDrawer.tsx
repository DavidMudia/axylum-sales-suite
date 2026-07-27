// src/components/products/ProductDrawer.tsx
import { X } from "lucide-react";
import ProductForm from "./ProductForm";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: any | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function ProductDrawer({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed right-0 top-0 z-50
          flex h-screen w-full flex-col
          bg-white shadow-2xl
          transition-transform duration-300
          sm:w-[620px] xl:w-[720px]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-8 text-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {initialData ? "Edit Product" : "New Product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage pricing, stock and product details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 text-slate-800">
          <ProductForm
            initialData={initialData}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
        </div>
      </aside>
    </>
  );
}