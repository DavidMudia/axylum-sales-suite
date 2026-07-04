export default function RecentCustomer() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">

        Recent Customers

      </h2>

      <div className="space-y-4">

        {[1,2,3,4].map((item)=>(
          <div
            key={item}
            className="flex items-center justify-between border-b pb-3"
          >

            <div>

              <p className="font-medium">
                Customer {item}
              </p>

              <p className="text-sm text-gray-500">
                customer@email.com
              </p>

            </div>

            <span className="text-green-600">
              Active
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}