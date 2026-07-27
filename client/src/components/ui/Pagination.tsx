import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;

  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total
  );

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

      {/* Info */}

      <p className="text-sm text-slate-600">

        Showing

        <span className="mx-1 font-semibold">

          {start}-{end}

        </span>

        of

        <span className="mx-1 font-semibold">

          {total}

        </span>

        products

      </p>

      {/* Controls */}

      <div className="flex items-center gap-2">

        <button
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-300
            transition
            hover:bg-slate-50
            disabled:opacity-40
          "
        >

          <ChevronLeft size={18} />

        </button>

        <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">

          {page}

        </span>

        <span className="text-sm text-slate-500">

          /

        </span>

        <span className="text-sm font-medium">

          {totalPages}

        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-300
            transition
            hover:bg-slate-50
            disabled:opacity-40
          "
        >

          <ChevronRight size={18} />

        </button>

      </div>

    </div>
  );
}