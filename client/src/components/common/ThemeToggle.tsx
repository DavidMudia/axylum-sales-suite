import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {

    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const dark = theme === "dark";

    return (
        <button
            onClick={() =>
                setTheme(
                    dark ? "light" : "dark"
                )
            }
            className="
            flex
            items-center
            justify-center
            h-10
            w-10
            rounded-xl
            border
            border-gray-300
            dark:border-slate-700
            hover:bg-gray-100
            dark:hover:bg-slate-800
            transition
            "
        >
            {dark ? (
                <Sun size={20}/>
            ) : (
                <Moon size={20}/>
            )}
        </button>
    );
}