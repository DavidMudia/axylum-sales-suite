import { useFieldArray, useForm } from "react-hook-form";
import { useCustomers } from "../../hooks/useCustomers";
import { useProducts } from "../../hooks/useProducts";
import {
  useCreateInvoice,
  useUpdateInvoice,
} from "../../hooks/useInvoices";

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
  invoiceId?: number;
};

export default function InvoiceForm({
  onClose,
  defaultValues,
  invoiceId,
}: Props) {
  const create = useCreateInvoice();
  const update = useUpdateInvoice();

  const { data: customers } = useCustomers("", 1);
  const { data: products } = useProducts("", 1);

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
      items: [
        {
          productId: 0,
          quantity: 1,
          unitPrice: 0,
        },
      ],
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
    (sum, item) =>
      sum + item.quantity * item.unitPrice,
    0
  );

  const total = subtotal + tax - discount;

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => {
        const payload = {
          ...data,
          subtotal,
          total,
        };

        if (invoiceId) {
          update.mutate(
            {
              id: invoiceId,
              data: payload,
            },
            {
              onSuccess() {
                onClose();
              },
            }
          );
        } else {
          create.mutate(payload, {
            onSuccess() {
              onClose();
            },
          });
        }
      })}
    >
      <select
        {...register("customerId", {
          valueAsNumber: true,
        })}
        className="w-full rounded-lg border p-3 text-lg"
      >
        <option value={0}>
          Select Customer
        </option>

        {customers?.data.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-xl border p-4 space-y-3 text-lg"
        >
          <select
            {...register(
              `items.${index}.productId`,
              {
                valueAsNumber: true,

                onChange(e) {
                  const p = products?.find(
                    (x: any) =>
                      x.id === Number(e.target.value)
                  );

                  if (p) {
                    setValue(
                      `items.${index}.unitPrice`,
                      p.unitPrice
                    );
                  }
                },
              }
            )}
            className="w-full rounded border p-3 text-lg"
          >
            <option value={0}>
              Select Product
            </option>

            {products?.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3 text-lg">
            <input
              type="number"
              placeholder="Qty"
              {...register(
                `items.${index}.quantity`,
                {
                  valueAsNumber: true,
                }
              )}
              className="rounded border p-3 text-lg"
            />

            <input
              type="number"
              placeholder="Price"
              {...register(
                `items.${index}.unitPrice`,
                {
                  valueAsNumber: true,
                }
              )}
              className="rounded border p-3 text-lg"
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
        onClick={() =>
          append({
            productId: 0,
            quantity: 1,
            unitPrice: 0,
          })
        }
        className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 text-lg"
      >
        + Add Item
      </button>

      <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-lg">
        <div className="flex justify-between text-lg">
          <span>Subtotal:</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-lg">
          <span>Tax:</span>
          <input
            type="number"
            {...register("tax", {
              valueAsNumber: true,
            })}
            className="w-24 rounded border p-1 text-right"
          />
        </div>

        <div className="flex justify-between text-lg">
          <span>Discount:</span>
          <input
            type="number"
            {...register("discount", {
              valueAsNumber: true,
            })}
            className="w-24 rounded border p-1 text-right text-lg"
          />
        </div>

        <div className="border-t pt-3 font-bold text-lg">
          <div className="flex justify-between text-lg">
            <span>Total:</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <textarea
        {...register("notes")}
        placeholder="Notes"
        rows={3}
        className="w-full rounded-lg border p-3 text-lg"
      />

      <button
        type="submit"
        disabled={create.isPending || update.isPending}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 text-lg"
      >
        {create.isPending || update.isPending
          ? "Saving..."
          : "Save Invoice"}
      </button>
    </form>
  );
}