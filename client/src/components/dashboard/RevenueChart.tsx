export default function RevenueChart() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          Revenue Overview
        </h2>

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          Live
        </span>

      </div>

      <div className="flex h-[300px] md:h-[420px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">

        Revenue chart coming soon...

      </div>

    </div>
  );
}