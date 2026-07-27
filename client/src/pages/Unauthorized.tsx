import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-10 shadow-lg text-center max-w-md">
        <ShieldX
          className="mx-auto mb-4 text-red-600"
          size={60}
        />

        <h1 className="text-2xl font-bold">
          Access Denied
        </h1>

        <p className="mt-3 text-slate-600">
          You don't have permission to
          access this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}