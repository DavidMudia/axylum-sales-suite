import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;

  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
};

export default function ProductActions({
  onView,
  onEdit,
  onDelete,

  canView = false,
  canEdit = false,
  canDelete = false,
}: Props) {
  return (
    <div className="flex justify-center gap-3 text-slate-800">

        {canView && (
            <button
                onClick={onView}
                className="text-blue-600 hover:text-blue-800"
            >
                <Eye size={18}/>
            </button>
        )}

        {canEdit && (
            <button
                onClick={onEdit}
                className="text-yellow-600 hover:text-yellow-800"
            >
                <Pencil size={18}/>
            </button>
        )}

        {canDelete && (
            <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
            >
                <Trash2 size={18}/>
            </button>
        )}

    </div>
);
}