export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="h-8 w-60 rounded bg-slate-300 dark:bg-slate-700" />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {Array.from({
          length: 8,
        }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-slate-300 dark:bg-slate-700"
          />
        ))}

      </div>

    </div>
  );
}