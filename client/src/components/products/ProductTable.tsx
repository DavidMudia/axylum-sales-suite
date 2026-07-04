import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";

export default function ProductTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts("", page);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">
                SKU
              </th>

              <th className="px-6 py-4 text-left">
                Product
              </th>

              <th className="px-6 py-4 text-left">
                Price
              </th>

              <th className="px-6 py-4 text-left">
                Qty
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {data?.map((product: any) => (

              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">
                  {product.sku}
                </td>

                <td className="px-6 py-4">
                  {product.name}
                </td>

                <td className="px-6 py-4">
                  ₦{product.unitPrice.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {product.quantity}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium
                      ${
                        product.status === "IN_STOCK"
                          ? "bg-green-100 text-green-700"
                          : product.status === "LOW_STOCK"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {product.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          className="rounded border px-4 py-2"
        >
          Previous
        </button>

        <span className="px-3 py-2">
          {page}
        </span>

        <button
          onClick={() =>
            setPage((p) => p + 1)
          }
          className="rounded border px-4 py-2"
        >
          Next
        </button>

      </div>
    </>
  );
}