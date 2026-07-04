import app from "./app";
import customerRoutes from "./modules/customers/customer.routes";

app.use("/api/customers", customerRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Lets go mf 🚀 Server running at http://localhost:${PORT}`);
});
import productRoutes from "./modules/products/product.routes";

app.use(
  "/api/products",
  productRoutes
);