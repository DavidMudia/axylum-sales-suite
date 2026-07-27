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

export default function QuoteActions({
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onView}
        className="rounded-lg p-2 hover:bg-blue-100"
      >
        <Eye size={18} />
      </button>

      <button
        onClick={onEdit}
        className="rounded-lg p-2 hover:bg-yellow-100"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={onDelete}
        className="rounded-lg p-2 hover:bg-red-100 text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}