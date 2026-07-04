import { useState } from "react";
import { X, Pencil } from "lucide-react";

import CustomerForm from "./CustomerForm";
import {
  useCustomer,
  useUpdateCustomer,
} from "../../hooks/useCustomers";

type Props = {
  customerId: number | null;
  open: boolean;
  onClose: () => void;
};

export default function CustomerDrawer({
  customerId,
  open,
  onClose,
}: Props) {
  const [editing, setEditing] = useState(false);

  const { data, isLoading } = useCustomer(customerId);

  const updateCustomer = useUpdateCustomer();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Drawer */}
      <div
        className={`
          fixed
          right-0
          top-0
          z-50
          h-screen
          w-full
          sm:w-[430px]
          overflow-y-auto
          bg-white
          shadow-2xl
        `}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            Customer
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {isLoading && (
          <div className="p-6">
            Loading...
          </div>
        )}

        {!editing && data && (
          <div className="space-y-6 p-6">

            <div>

              <p className="text-sm text-gray-500">
                Name
              </p>

              <h3 className="text-xl font-semibold">
                {data.name}
              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Company
              </p>

              <p>{data.companyName || "-"}</p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p>{data.email || "-"}</p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p>{data.phone}</p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Address
              </p>

              <p>{data.address || "-"}</p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Notes
              </p>

              <p>{data.notes || "-"}</p>

            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              <Pencil size={18} />
              Edit Customer
            </button>

          </div>
        )}

        {editing && data && (
          <div className="p-6">

            <CustomerForm
              defaultValues={data}
              onSubmit={(values) => {
                updateCustomer.mutate(
                  {
                    id: data.id,
                    data: values,
                  },
                  {
                    onSuccess() {
                      setEditing(false);
                    },
                  }
                );
              }}
            />

          </div>
        )}
      </div>
    </>
  );
}