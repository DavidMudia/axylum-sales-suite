import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Palette,
  Monitor,
  Layout,
  Type,
  Table,
} from "lucide-react";

import {
  useSettings,
  useUpdateSettings,
} from "../../hooks/useSettings";

type FormData = {
  theme: "LIGHT" | "DARK" | "SYSTEM";
  primaryColor: string;
  sidebarCollapsed: boolean;
  compactMode: boolean;
  fontSize: "SMALL" | "MEDIUM" | "LARGE";
  tableDensity: "COMPACT" | "COMFORTABLE" | "SPACIOUS";
};

export default function AppearanceSettings() {
  const { data } = useSettings();
  const update = useUpdateSettings();

  const {
    register,
    reset,
    handleSubmit,
  } = useForm<FormData>();

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        update.mutate(values)
      )}
      className="space-y-8"
    >
      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Monitor size={22} />
          Theme
        </h2>

        <select
          {...register("theme")}
          className="w-full rounded-lg border p-3"
        >
          <option value="LIGHT">Light</option>
          <option value="DARK">Dark</option>
          <option value="SYSTEM">System</option>
        </select>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Palette size={22} />
          Primary Color
        </h2>

        <input
          type="color"
          {...register("primaryColor")}
          className="h-16 w-full rounded-lg border cursor-pointer"
        />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Layout size={22} />
          Layout
        </h2>

        <div className="space-y-5">
          <label className="flex items-center justify-between">
            Sidebar Collapsed
            <input
              type="checkbox"
              {...register("sidebarCollapsed")}
            />
          </label>

          <label className="flex items-center justify-between">
            Compact Mode
            <input
              type="checkbox"
              {...register("compactMode")}
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Type size={22} />
          Font Size
        </h2>

        <select
          {...register("fontSize")}
          className="w-full rounded-lg border p-3"
        >
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
        </select>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Table size={22} />
          Table Density
        </h2>

        <select
          {...register("tableDensity")}
          className="w-full rounded-lg border p-3"
        >
          <option value="COMPACT">Compact</option>
          <option value="COMFORTABLE">Comfortable</option>
          <option value="SPACIOUS">Spacious</option>
        </select>
      </div>

      <button
        disabled={update.isPending}
        className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {update.isPending ? "Saving..." : "Save Appearance"}
      </button>
    </form>
  );
}