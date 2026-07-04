import { Eye, Pencil, Trash2 } from "lucide-react";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CustomerActions({
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex justify-center gap-3">

      <button
        onClick={onView}
        className="text-blue-600 hover:text-blue-800"
      >
        <Eye size={18} />
      </button>

      <button
        onClick={onEdit}
        className="text-green-600 hover:text-green-800"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}