// src/components/payments/PaymentActions.tsx
import { MoreVertical, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
  showApprove?: boolean;
  showCancel?: boolean;
};

export default function PaymentActions({
  onEdit,
  onDelete,
  onApprove,
  onCancel,
  showApprove = false,
  showCancel = false,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 hover:bg-slate-100"
      >
        <MoreVertical size={16} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-10">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Edit size={16} />
            Edit
          </button>
          {showApprove && onApprove && (
            <button
              onClick={() => {
                onApprove();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle size={16} />
              Approve
            </button>
          )}
          {showCancel && onCancel && (
            <button
              onClick={() => {
                onCancel();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <XCircle size={16} />
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 border-t border-slate-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}