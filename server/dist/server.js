"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/server.ts
const app_1 = __importDefault(require("./app"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const customer_routes_1 = __importDefault(require("./modules/customers/customer.routes"));
const goods_receipt_routes_1 = __importDefault(require("./modules/goods-receipt/goods-receipt.routes"));
const product_routes_1 = __importDefault(require("./modules/products/product.routes"));
const quote_routes_1 = __importDefault(require("./modules/quotes/quote.routes"));
const expense_routes_1 = __importDefault(require("./modules/expenses/expense.routes"));
const supplier_routes_1 = __importDefault(require("./modules/suppliers/supplier.routes"));
const purchase_order_routes_1 = __importDefault(require("./modules/purchase-orders/purchase-order.routes"));
const invoice_routes_1 = __importDefault(require("./modules/invoices/invoice.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const refund_routes_1 = __importDefault(require("./modules/refunds/refund.routes"));
const waybill_routes_1 = __importDefault(require("./modules/waybills/waybill.routes"));
const settings_routes_1 = __importDefault(require("./modules/settings/settings.routes"));
const warehouse_routes_1 = __importDefault(require("./modules/warehouses/warehouse.routes"));
const command_center_routes_1 = __importDefault(require("./modules/command-center/command-center.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/order.routes"));
// ✅ NEW – User & Role management
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const role_routes_1 = __importDefault(require("./modules/roles/role.routes"));
// ✅ NEW – Reports
const report_routes_1 = __importDefault(require("./modules/reports/report.routes"));
// ============================================================
// Mount API routes
// ============================================================
app_1.default.use("/api/auth", auth_routes_1.default);
app_1.default.use("/api/customers", customer_routes_1.default);
app_1.default.use("/api/warehouses", warehouse_routes_1.default);
app_1.default.use("/api/products", product_routes_1.default);
app_1.default.use("/api/quotes", quote_routes_1.default);
app_1.default.use("/api/invoices", invoice_routes_1.default);
app_1.default.use("/api/payments", payment_routes_1.default);
app_1.default.use("/api/refunds", refund_routes_1.default);
app_1.default.use("/api/goods-receipts", goods_receipt_routes_1.default);
app_1.default.use("/api/settings", settings_routes_1.default);
app_1.default.use("/api/command-center", command_center_routes_1.default);
app_1.default.use("/api/suppliers", supplier_routes_1.default);
app_1.default.use("/api/purchase-orders", purchase_order_routes_1.default);
app_1.default.use("/api/waybills", waybill_routes_1.default);
app_1.default.use("/api/orders", order_routes_1.default);
app_1.default.use("/api/dashboard", dashboard_routes_1.default);
app_1.default.use("/api/expenses", expense_routes_1.default);
// ✅ Mount Users & Roles
app_1.default.use("/api/users", user_routes_1.default);
app_1.default.use("/api/roles", role_routes_1.default);
// ✅ Mount Reports
app_1.default.use("/api/reports", report_routes_1.default);
const PORT = 5000;
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
