import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        `
        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl

        px-5
        py-2.5

        text-sm
        font-semibold

        transition-all
        duration-200

        disabled:cursor-not-allowed
        disabled:opacity-50
        `,

        {
          "bg-blue-600 text-white hover:bg-blue-700":
            variant === "primary",

          "border border-slate-300 bg-white hover:bg-slate-50":
            variant === "secondary",

          "bg-red-600 text-white hover:bg-red-700":
            variant === "danger",

          "hover:bg-slate-100":
            variant === "ghost",
        },

        className
      )}
    >
      {children}
    </button>
  );
}