import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function InvoiceActions({
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <button
        onClick={onView}
        className="rounded p-2 hover:bg-gray-100"
      >
        <Eye size={18} />
      </button>

      <button
        onClick={onEdit}
        className="rounded p-2 hover:bg-blue-100"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() => {
          if (
            window.confirm(
              "Delete this invoice?"
            )
          ) {
            onDelete();
          }
        }}
        className="rounded p-2 text-red-600 hover:bg-red-100"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}