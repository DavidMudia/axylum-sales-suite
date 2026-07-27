import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-20 text-white">

          <h1 className="text-5xl font-black">
            Axylum Sales Suite
          </h1>

          <p className="mt-6 max-w-lg text-lg text-blue-100 leading-relaxed">
            Modern ERP built for distributors.
            Inventory, Sales, Warehousing,
            Fleet, Finance and Reporting —
            all in one place.
          </p>

        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-center p-8">

          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-10 shadow-xl">

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}