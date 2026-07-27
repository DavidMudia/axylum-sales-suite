import { Bell } from "lucide-react";

export default function NotificationButton() {

    return (

        <button
            className="
            relative
            h-10
            w-10
            rounded-xl
            border
            border-gray-300
            hover:bg-gray-100
            dark:border-slate-700
            dark:hover:bg-slate-800
            "
        >

            <Bell
                size={19}
                className="mx-auto"
            />

            <span
                className="
                absolute
                right-2
                top-2
                h-2.5
                w-2.5
                rounded-full
                bg-red-500
                "
            />

        </button>

    );

}