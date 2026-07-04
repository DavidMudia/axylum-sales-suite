import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerForm from "../components/customers/CustomerForm";
import Modal from "../components/ui/Modal";

import { useCreateCustomer } from "../hooks/useCustomers";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const createCustomer = useCreateCustomer();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <h1 className="text-2xl md:text-3xl font-bold">
            Customers
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Add Customer
          </button>

        </div>

        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 rounded-lg border p-3"
        />

        <CustomerTable search={search} />

      </div>

      <Modal
        open={open}
        title="Add Customer"
        onClose={() => setOpen(false)}
      >
        <CustomerForm
          onSubmit={(data) =>
            createCustomer.mutate(data, {
              onSuccess() {
                setOpen(false);
              },
            })
          }
        />
      </Modal>

    </DashboardLayout>
  );
}