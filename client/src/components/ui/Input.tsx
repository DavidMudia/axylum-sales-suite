import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  required,
  className,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
  {...props}
  className={clsx(
    `
    w-full
    rounded-xl
    border
    border-slate-300

    bg-white
    text-slate-900

    px-4
    py-3

    text-sm

    outline-none

    transition-all
    duration-200

    placeholder:text-slate-400

    focus:border-blue-600
    focus:ring-4
    focus:ring-blue-100

    disabled:bg-slate-100
    disabled:text-slate-500
    `,

    error &&
      "border-red-500 focus:border-red-500 focus:ring-red-100",

    className
  )}
/>

      {helperText && !error && (
        <p className="text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}