import { ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {

    const { user } = useAuth();

    return (

        <button
            className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-2
            hover:bg-gray-100
            dark:hover:bg-slate-800
            "
        >

            <img
                src="https://i.pravatar.cc/80"
                className="h-10 w-10 rounded-full"
            />

            <div className="hidden md:block text-left">

                <p className="font-semibold">
                    {user?.name}
                </p>

                <p className="text-xs text-gray-500">
                    Administrator
                </p>

            </div>

            <ChevronDown size={18}/>

        </button>

    );

}