import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(6, "Phone is required"),
});

export type FormData = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
};

export default function CustomerForm({
  onSubmit,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <input
          {...register("name")}
          placeholder="Customer Name"
          className="w-full rounded-lg border p-3"
        />
        <p className="mt-1 text-sm text-red-500">
          {errors.name?.message}
        </p>
      </div>

      <div>
        <input
          {...register("companyName")}
          placeholder="Company"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-lg border p-3"
        />
        <p className="mt-1 text-sm text-red-500">
          {errors.email?.message}
        </p>
      </div>

      <div>
        <input
          {...register("phone")}
          placeholder="Phone"
          className="w-full rounded-lg border p-3"
        />
        <p className="mt-1 text-sm text-red-500">
          {errors.phone?.message}
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {defaultValues ? "Update Customer" : "Create Customer"}
      </button>
    </form>
  );
}