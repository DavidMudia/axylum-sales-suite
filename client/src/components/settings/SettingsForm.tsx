import { useForm } from "react-hook-form";
import {
  useSettings,
  useUpdateSettings,
} from "../../hooks/useSettings";

type FormData = {
  companyName: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  currency: string;
  tax: number;
  quotePrefix: string;
  invoicePrefix: string;
  quoteValidity: number;
  invoiceDueDays: number;
};

export default function SettingsForm() {
  const { data } = useSettings();
  const update = useUpdateSettings();

  const {
    register,
    handleSubmit,
  } = useForm<FormData>({
    values: {
      companyName: data?.companyName ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      website: data?.website ?? "",
      address: data?.address ?? "",
      city: data?.city ?? "",
      state: data?.state ?? "",
      country: data?.country ?? "",
      currency: data?.currency ?? "NGN",
      tax: data?.tax ?? 0,
      quotePrefix: data?.quotePrefix ?? "QT",
      invoicePrefix: data?.invoicePrefix ?? "INV",
      quoteValidity: data?.quoteValidity ?? 30,
      invoiceDueDays: data?.invoiceDueDays ?? 30,
    },
  });

  const onSubmit = (values: FormData) => {
    update.mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">

        <input
          {...register("companyName")}
          placeholder="Company Name"
          className="rounded-lg border p-3"
        />

        <input
          {...register("email")}
          placeholder="Email"
          className="rounded-lg border p-3"
        />

        <input
          {...register("phone")}
          placeholder="Phone"
          className="rounded-lg border p-3"
        />

        <input
          {...register("website")}
          placeholder="Website"
          className="rounded-lg border p-3"
        />

        <input
          {...register("address")}
          placeholder="Address"
          className="rounded-lg border p-3"
        />

        <input
          {...register("city")}
          placeholder="City"
          className="rounded-lg border p-3"
        />

        <input
          {...register("state")}
          placeholder="State"
          className="rounded-lg border p-3"
        />

        <input
          {...register("country")}
          placeholder="Country"
          className="rounded-lg border p-3"
        />

        <select
          {...register("currency")}
          className="rounded-lg border p-3"
        >
          <option value="NGN">NGN (₦)</option>
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
          <option value="EUR">EUR (€)</option>
        </select>

        <input
          type="number"
          {...register("tax", {
            valueAsNumber: true,
          })}
          placeholder="Default Tax (%)"
          className="rounded-lg border p-3"
        />

        <input
          {...register("quotePrefix")}
          placeholder="Quote Prefix"
          className="rounded-lg border p-3"
        />

        <input
          {...register("invoicePrefix")}
          placeholder="Invoice Prefix"
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          {...register("quoteValidity", {
            valueAsNumber: true,
          })}
          placeholder="Quote Validity (Days)"
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          {...register("invoiceDueDays", {
            valueAsNumber: true,
          })}
          placeholder="Invoice Due Days"
          className="rounded-lg border p-3"
        />

      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Save Settings
      </button>
    </form>
  );
}