// src/components/products/ProductForm.tsx
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

type Props = {
  initialData?: any | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  onCancel: () => void;
};

export default function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    unit: "BAG",
    costPrice: "",
    sellingPrice: "",
    currentStock: "",
    minimumStock: "",
    description: "",
    image: null as File | null,
    imagePreview: "",
    password: "", // ✅ added
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        sku: initialData.sku ?? "",
        barcode: initialData.barcode ?? "",
        unit: initialData.unit ?? "BAG",
        costPrice: initialData.costPrice ?? "",
        sellingPrice: initialData.sellingPrice ?? "",
        currentStock: initialData.currentStock ?? "",
        minimumStock: initialData.minimumStock ?? "",
        description: initialData.description ?? "",
        image: null,
        imagePreview: initialData.imageUrl ?? "",
        password: "", // reset password field
      });
    } else {
      setForm({
        name: "",
        sku: "",
        barcode: "",
        unit: "BAG",
        costPrice: "",
        sellingPrice: "",
        currentStock: "",
        minimumStock: "",
        description: "",
        image: null,
        imagePreview: "",
        password: "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      costPrice: parseFloat(form.costPrice) || 0,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      currentStock: parseFloat(form.currentStock) || 0,
      minimumStock: parseFloat(form.minimumStock) || 0,
      password: form.password, // send password for verification
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* General Information */}
      <section>
        <h3 className="mb-5 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-900">
          General Information
        </h3>
        <div className="grid gap-5 md:grid-cols-2 text-slate-800">
          <Input
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Dangote Cement 42.5R"
          />
          <Input
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
          />
          <Input
            label="Barcode"
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700"
            >
              <option value="BAG">BAG</option>
              <option value="PIECE">PIECE</option>
              <option value="ROD">ROD</option>
              <option value="ROLL">ROLL</option>
              <option value="BUNDLE">BUNDLE</option>
              <option value="CARTON">CARTON</option>
              <option value="KG">KG</option>
              <option value="LITRE">LITRE</option>
              <option value="TON">TON</option>
            </select>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="mb-5 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-800">
          Pricing
        </h3>
        <div className="grid gap-5 md:grid-cols-2 text-slate-800">
          <Input
            label="Cost Price"
            name="costPrice"
            type="number"
            value={form.costPrice}
            onChange={handleChange}
          />
          <Input
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={form.sellingPrice}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Inventory – only minimumStock and currentStock (opening stock) */}
      <section>
        <h3 className="mb-5 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-800">
          Inventory
        </h3>
        <div className="grid gap-5 md:grid-cols-2 text-slate-800">
          <Input
            label="Current Stock"
            name="currentStock"
            type="number"
            value={form.currentStock}
            onChange={handleChange}
          />
          <Input
            label="Minimum Stock"
            name="minimumStock"
            type="number"
            value={form.minimumStock}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Image upload */}
      <section>
        <h3 className="mb-5 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-800">
          Product Image
        </h3>
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8">
          {form.imagePreview ? (
            <div className="space-y-4">
              <img
                src={form.imagePreview}
                alt="Preview"
                className="h-48 w-full rounded-xl object-cover"
              />
              <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4-4a2 2 0 012.828 0L16 17m-2-2l1-1a2 2 0 012.828 0L20 16m-6-8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-center">
                <p className="font-medium text-slate-800">Upload Product Image</p>
                <p className="text-sm text-slate-500">PNG, JPG or WEBP up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </section>

      {/* Description */}
      <section>
        <h3 className="mb-5 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Description
        </h3>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe this product..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 resize-none"
        />
      </section>

      {/* Password for authentication */}
      <section>
        <h3 className="mb-5 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-800">
          Confirm Action
        </h3>
        <div className="grid gap-5 md:grid-cols-1 text-slate-800">
          <Input
            label="Enter your password to confirm"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your account password"
            required
          />
        </div>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 flex justify-end gap-4 border-t border-slate-200 bg-white pt-6 text-slate-500">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}