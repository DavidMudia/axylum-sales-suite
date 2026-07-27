// src/components/quotes/QuoteForm.tsx
import { useFieldArray, useForm } from "react-hook-form";
import { useCustomers } from "../../hooks/useCustomers";
import { useProducts } from "../../hooks/useProducts";
import { useCreateQuote, useUpdateQuote } from "../../hooks/useQuotes";

type FormData = {
  customerId: number;
  tax: number;
  discount: number;
  notes: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
};

type Props = {
  onClose: () => void;
  defaultValues?: any;
  quoteId?: number;
};

export default function QuoteForm({ onClose, defaultValues, quoteId }: Props) {
  const create = useCreateQuote();
  const update = useUpdateQuote();

  // ✅ Access the data property from the response
  const { data: customersData } = useCustomers("", 1);
  const { data: productsData } = useProducts("", 1);

  const customers = customersData?.data ?? [];
  const products = productsData?.data ?? [];

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      customerId: 0,
      tax: 0,
      discount: 0,
      notes: "",
      items: [{ productId: 0, quantity: 1, unitPrice: 0 }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const tax = Number(watch("tax")) || 0;
  const discount = Number(watch("discount")) || 0;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const total = subtotal + tax - discount;

  return (
    <form
      className="space-y-6 text-slate-900"
      onSubmit={handleSubmit((data) => {
        const payload = {
          ...data,
          subtotal,
          total,
        };
        if (quoteId) {
          update.mutate(
            { id: quoteId, data: payload },
            { onSuccess: () => onClose() }
          );
        } else {
          create.mutate(payload, { onSuccess: () => onClose() });
        }
      })}
    >
      <select
        {...register("customerId", { valueAsNumber: true })}
        className="w-full rounded-lg border p-3"
      >
        <option value={0}>Select Customer</option>
        {customers.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {fields.map((field, index) => (
        <div key={field.id} className="rounded-xl border p-4 space-y-3">
          <select
            {...register(`items.${index}.productId`, {
              valueAsNumber: true,
              onChange(e) {
                const p = products.find(
                  (x: any) => x.id === Number(e.target.value)
                );
                if (p) {
                  setValue(`items.${index}.unitPrice`, p.sellingPrice || p.unitPrice);
                }
              },
            })}
            className="w-full rounded border p-3"
          >
            <option value={0}>Select Product</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Qty"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              className="rounded border p-3"
            />
            <input
              type="number"
              placeholder="Price"
              {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              className="rounded border p-3"
            />
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0 })}
        className="rounded-lg border px-4 py-2"
      >
        + Add Product
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="number"
          placeholder="Tax"
          {...register("tax", { valueAsNumber: true })}
          className="rounded border p-3"
        />
        <input
          type="number"
          placeholder="Discount"
          {...register("discount", { valueAsNumber: true })}
          className="rounded border p-3"
        />
      </div>

      <textarea
        placeholder="Notes"
        {...register("notes")}
        className="w-full rounded border p-3"
      />

      <div className="rounded-xl bg-gray-100 p-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₦{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>₦{discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      <button className="w-full rounded-lg bg-blue-600 py-3 text-white">
        Save Quote
      </button>
    </form>
  );
}