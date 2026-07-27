import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm

        p-6
        lg:p-7

        transition-all
        duration-200

        ${className}
      `}
    >
      {children}
    </div>
  );
}