import { useState } from "react";
import CustomerActions from "./CustomerActions";

import {
  useCustomers,
  useDeleteCustomer,
} from "../../hooks/useCustomers";

import ConfirmDialog from "../ui/ConfirmDialog";

export default function CustomerTable({
  search,
}: {
  search: string;
}) {

  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useCustomers(search, page);

  const remove = useDeleteCustomer();

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-white shadow">

        <table className="min-w-[900px] w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">Name</th>

              <th className="px-6 py-4 text-left">Company</th>

              <th className="px-6 py-4 text-left">Phone</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {data?.map((customer) => (

              <tr
                key={customer.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">
                  {customer.name}
                </td>

                <td className="px-6 py-4">
                  {customer.companyName || "-"}
                </td>

                <td className="px-6 py-4">
                  {customer.phone}
                </td>

                <td className="px-6 py-4">

                  <span
  className={`rounded-full px-3 py-1 text-sm font-medium
  ${
    customer.status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : customer.status === "LEAD"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {customer.status}
</span>

                </td>

                <td className="px-6 py-4 text-center">

                  <CustomerActions
  onView={() => {
    // next step
  }}
  onEdit={() => {
    // next step
  }}
  onDelete={() => setDeleteId(customer.id)}
/>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">

  <button
    className="rounded border px-4 py-2"
    onClick={() =>
      setPage((p) => Math.max(1, p - 1))
    }
  >
    Previous
  </button>

  <span className="font-semibold">
    Page {page}
  </span>

  <button
    className="rounded border px-4 py-2"
    onClick={() =>
      setPage((p) => p + 1)
    }
  >
    Next
  </button>

</div>

      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) {
            remove.mutate(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </>
  );
}