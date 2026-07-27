// server/src/server.ts
import app from "./app";

import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import customerRoutes from "./modules/customers/customer.routes";
import goodsReceiptRoutes from "./modules/goods-receipt/goods-receipt.routes";
import productRoutes from "./modules/products/product.routes";
import quoteRoutes from "./modules/quotes/quote.routes";
import expenseRoutes from "./modules/expenses/expense.routes";
import supplierRoutes from "./modules/suppliers/supplier.routes";
import purchaseOrderRoutes from './modules/purchase-orders/purchase-order.routes';
import invoiceRoutes from "./modules/invoices/invoice.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import refundRoutes from "./modules/refunds/refund.routes";
import waybillRoutes from "./modules/waybills/waybill.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import warehouseRoutes from "./modules/warehouses/warehouse.routes";
import commandCenterRoutes from "./modules/command-center/command-center.routes";
import authRoutes from "./modules/auth/auth.routes";
import orderRoutes from "./modules/orders/order.routes";

// ✅ NEW – User & Role management
import userRoutes from "./modules/users/user.routes";
import roleRoutes from "./modules/roles/role.routes";

// ✅ NEW – Reports
import reportRoutes from "./modules/reports/report.routes";

// ============================================================
// Mount API routes
// ============================================================

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/goods-receipts", goodsReceiptRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/command-center", commandCenterRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/waybills", waybillRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.use("/api/expenses", expenseRoutes);

// ✅ Mount Users & Roles
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

// ✅ Mount Reports
app.use("/api/reports", reportRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});