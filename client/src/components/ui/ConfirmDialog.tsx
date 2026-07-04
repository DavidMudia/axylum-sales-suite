import Modal from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      title="Delete Customer"
      onClose={onClose}
    >
      <p className="mb-6">
        Are you sure?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>

      </div>
    </Modal>
  );
}