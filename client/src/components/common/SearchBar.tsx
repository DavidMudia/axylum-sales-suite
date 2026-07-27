import { Search } from "lucide-react";

export default function SearchBar() {
    return (

        <div className="hidden lg:flex items-center w-96">

            <div className="relative w-full">

                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    placeholder="Search customers, invoices, products..."
                    className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-gray-50
                    py-2.5
                    pl-10
                    pr-4
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    dark:bg-slate-800
                    dark:border-slate-700
                    "
                />

            </div>

        </div>

    );
}