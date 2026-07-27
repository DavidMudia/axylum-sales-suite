import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  DollarSign,
  Percent,
  FileText,
  Receipt,
  CreditCard,
  Calendar,
  Calculator,
} from "lucide-react";

import {
  useSettings,
  useUpdateSettings,
} from "../../hooks/useSettings";

type FormData = {
  currency: string;
  currencySymbol: string;

  tax: number;

  quotePrefix: string;
  invoicePrefix: string;
  paymentPrefix: string;
  expensePrefix: string;

  quoteValidity: number;
  invoiceDueDays: number;

  decimalPlaces: number;
};

export default function FinanceSettings() {
  const { data } = useSettings();
  const update = useUpdateSettings();

  const {
    register,
    reset,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      currency: "NGN",
      currencySymbol: "₦",
      tax: 0,
      quotePrefix: "QT",
      invoicePrefix: "INV",
      paymentPrefix: "PAY",
      expensePrefix: "EXP",
      quoteValidity: 30,
      invoiceDueDays: 30,
      decimalPlaces: 2,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        currency: data.currency,
        currencySymbol:
          data.currencySymbol,
        tax: data.tax,
        quotePrefix:
          data.quotePrefix,
        invoicePrefix:
          data.invoicePrefix,
        paymentPrefix:
          data.paymentPrefix,
        expensePrefix:
          data.expensePrefix,
        quoteValidity:
          data.quoteValidity,
        invoiceDueDays:
          data.invoiceDueDays,
        decimalPlaces:
          data.decimalPlaces,
      });
    }
  }, [data, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        update.mutate(values)
      )}
      className="space-y-8"
    >
      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">
          Currency
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            icon={<DollarSign size={18} />}
            label="Currency"
            register={register("currency")}
          />

          <Input
            icon={<DollarSign size={18} />}
            label="Currency Symbol"
            register={register("currencySymbol")}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">
          Tax
        </h2>

        <Input
          type="number"
          icon={<Percent size={18} />}
          label="Default Tax"
          register={register("tax", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">
          Document Prefixes
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            icon={<FileText size={18} />}
            label="Quote Prefix"
            register={register("quotePrefix")}
          />

          <Input
            icon={<Receipt size={18} />}
            label="Invoice Prefix"
            register={register("invoicePrefix")}
          />

          <Input
            icon={<CreditCard size={18} />}
            label="Payment Prefix"
            register={register("paymentPrefix")}
          />

          <Input
            icon={<DollarSign size={18} />}
            label="Expense Prefix"
            register={register("expensePrefix")}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">
          Defaults
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <Input
            type="number"
            icon={<Calendar size={18} />}
            label="Quote Validity"
            register={register("quoteValidity", {
              valueAsNumber: true,
            })}
          />

          <Input
            type="number"
            icon={<Calendar size={18} />}
            label="Invoice Due Days"
            register={register("invoiceDueDays", {
              valueAsNumber: true,
            })}
          />

          <Input
            type="number"
            icon={<Calculator size={18} />}
            label="Decimal Places"
            register={register("decimalPlaces", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>

      <button
        disabled={update.isPending}
        className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white"
      >
        {update.isPending
          ? "Saving..."
          : "Save Finance Settings"}
      </button>
    </form>
  );
}

function Input({
  icon,
  label,
  register,
  type = "text",
}: any) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-medium">
        {icon}
        {label}
      </label>

      <input
        type={type}
        {...register}
        className="w-full rounded-lg border p-3"
      />
    </div>
  );
}