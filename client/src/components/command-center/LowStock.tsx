type Props = {
  products: any[];
};

export default function LowStock({
  products,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">
        Low Stock
      </h2>

      <div className="space-y-3">
        {products.length === 0 ? (
          <p>No low stock products.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between border-b pb-2"
            >
              <button className="font-medium hover:text-blue-600">
  {product.name}
</button>

              <span className="font-bold text-red-600">
                {product.quantity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}