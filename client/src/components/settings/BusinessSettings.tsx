import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Camera,
  Landmark,
} from "lucide-react";

import {
  useSettings,
  useUpdateSettings,
} from "../../hooks/useSettings";

type FormData = {
  companyName: string;
  industry: string;
  registrationNumber: string;
  taxNumber: string;

  email: string;
  phone: string;
  website: string;

  address: string;
  city: string;
  state: string;
  country: string;
};

export default function BusinessSettings() {
  const { data } = useSettings();
  const update = useUpdateSettings();

  const {
    register,
    reset,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      companyName: "",
      industry: "",
      registrationNumber: "",
      taxNumber: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        companyName: data.companyName ?? "",
        industry: data.industry ?? "",
        registrationNumber:
          data.registrationNumber ?? "",
        taxNumber: data.taxNumber ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        website: data.website ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        country: data.country ?? "",
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
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed bg-gray-100">
            <Camera
              size={34}
              className="text-gray-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Business Profile
            </h2>

            <p className="mt-2 text-gray-500">
              Configure your company information.
            </p>

            <button
              type="button"
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Upload Logo
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h3 className="mb-6 text-xl font-semibold">
          Company Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            icon={<Building2 size={18} />}
            label="Company Name"
            register={register("companyName")}
          />

          <Input
            icon={<Landmark size={18} />}
            label="Industry"
            register={register("industry")}
          />

          <Input
            icon={<Mail size={18} />}
            label="Email"
            register={register("email")}
          />

          <Input
            icon={<Phone size={18} />}
            label="Phone"
            register={register("phone")}
          />

          <Input
            icon={<Globe size={18} />}
            label="Website"
            register={register("website")}
          />

          <Input
            icon={<Building2 size={18} />}
            label="Registration Number"
            register={register("registrationNumber")}
          />

          <Input
            icon={<Building2 size={18} />}
            label="Tax Number"
            register={register("taxNumber")}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h3 className="mb-6 text-xl font-semibold">
          Address
        </h3>

        <textarea
          rows={4}
          {...register("address")}
          className="w-full rounded-lg border p-3"
        />

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Input
            icon={<MapPin size={18} />}
            label="City"
            register={register("city")}
          />

          <Input
            icon={<MapPin size={18} />}
            label="State"
            register={register("state")}
          />

          <Input
            icon={<MapPin size={18} />}
            label="Country"
            register={register("country")}
          />
        </div>
      </div>

      <button
        disabled={update.isPending}
        className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white"
      >
        {update.isPending
          ? "Saving..."
          : "Save Business Information"}
      </button>
    </form>
  );
}

function Input({
  icon,
  label,
  register,
}: any) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-medium">
        {icon}
        {label}
      </label>

      <input
        {...register}
        className="w-full rounded-lg border p-3"
      />
    </div>
  );
}