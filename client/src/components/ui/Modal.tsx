import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({
  open,
  title,
  onClose,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500px]">

        <div className="flex justify-between items-center border-b p-5">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="p-6">

          {children}

        </div>

      </div>
    </div>
  );
}