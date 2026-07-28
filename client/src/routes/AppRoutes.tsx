// src/routes/AppRoutes.tsx
import {
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Invoices from '../pages/Invoices';
import Roles from '../pages/Roles';
import Settings from '../pages/Settings';
import InvoiceDetails from '../pages/InvoiceDetails';
import ProductDetails from "../pages/ProductDetails";
import Register from "../pages/Register";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Suppliers from "../pages/Suppliers";
import SupplierDetails from "../pages/SupplierDetails";
import Customers from "../pages/Customers";
import InventoryReport from '../pages/InventoryReport';
import CustomerDetails from "../pages/CustomerDetails";
import PurchaseOrders from '../pages/PurchaseOrders';
import PurchaseOrderDetails from '../pages/PurchaseOrderDetails';
import Unauthorized from "../pages/Unauthorized";
import Quotes from '../pages/Quotes';
import QuoteDetails from '../pages/QuoteDetails';
import SalesOrders from '../pages/SalesOrders';
import OrderDetails from '../pages/OrderDetails';
import WarehouseDashboard from "../pages/warehouses/WarehouseDashboard";
import WarehouseDetails from "../pages/warehouses/WarehouseDetails";
import CreateWarehouse from "../pages/warehouses/CreateWarehouse";
import Payments from '../pages/Payments';
import PaymentDetails from '../pages/PaymentDetails';
import Refunds from '../pages/Refunds';
import RefundDetails from '../pages/RefundDetails';
import GoodsReceiptDashboard from "../pages/goods-receipts/GoodsReceiptDashboard";
import GoodsReceiptDetails from "../pages/goods-receipts/GoodsReceiptsDetails";
import CreateGoodsReceipt from "../pages/goods-receipts/CreateGoodsReceipts";
import Waybills from '../pages/Waybills';
import CreateWaybill from '../pages/CreateWaybill';
import WaybillDetails from '../pages/WaybillDetails';
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Users from '../pages/Users';
import SalesReport from '../pages/SalesReport';
import FinancialReport from '../pages/FinancialReports';
import { PERMISSIONS } from "../constants/permissions";
import Expenses from '../pages/Expenses';

const RedirectWithParams = ({ to, replace = true }: { to: string; replace?: boolean }) => {
  const params = useParams<{ id: string }>();
  const target = to.replace(/:([a-zA-Z]+)/g, (_, key) => params[key as keyof typeof params] || '');
  return <Navigate to={target} replace={replace} />;
};

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Application */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Invoices */}
        <Route path="/invoices" element={<ProtectedRoute permission={PERMISSIONS.INVOICE.READ}><Invoices /></ProtectedRoute>} />
        <Route path="/invoices/:id" element={<ProtectedRoute permission={PERMISSIONS.INVOICE.READ}><InvoiceDetails /></ProtectedRoute>} />

        {/* Waybills */}
        <Route path="/waybills" element={<ProtectedRoute permission={PERMISSIONS.WAYBILL.READ}><Waybills /></ProtectedRoute>} />
        <Route path="/waybills/new" element={<ProtectedRoute permission={PERMISSIONS.WAYBILL.CREATE}><CreateWaybill /></ProtectedRoute>} />
        <Route path="/waybills/:id" element={<ProtectedRoute permission={PERMISSIONS.WAYBILL.READ}><WaybillDetails /></ProtectedRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute permission={PERMISSIONS.DASHBOARD.VIEW}><Dashboard /></ProtectedRoute>} />
<Route path="/expenses" element={<ProtectedRoute permission={PERMISSIONS.EXPENSES.READ}><Expenses /></ProtectedRoute>} />
<Route path="/settings" element={<ProtectedRoute permission={PERMISSIONS.SETTINGS.READ}><Settings /></ProtectedRoute>} />
        {/* Products */}
        <Route path="/products" element={<ProtectedRoute permission={PERMISSIONS.INVENTORY.READ}><Products /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute permission={PERMISSIONS.INVENTORY.READ}><ProductDetails /></ProtectedRoute>} />

        {/* Roles */}
        <Route path="/roles" element={<ProtectedRoute permission={PERMISSIONS.ROLE.READ}><Roles /></ProtectedRoute>} />

        {/* Payments */}
        <Route path="/payments" element={<ProtectedRoute permission={PERMISSIONS.PAYMENT.READ}><Payments /></ProtectedRoute>} />
        <Route path="/payments/:id" element={<ProtectedRoute permission={PERMISSIONS.PAYMENT.READ}><PaymentDetails /></ProtectedRoute>} />

        {/* Users */}
        <Route path="/users" element={<ProtectedRoute permission={PERMISSIONS.USER.READ}><Users /></ProtectedRoute>} />
<Route
  path="/register"
  element={<Register />}
/>
        {/* Refunds */}
        <Route path="/refunds" element={<ProtectedRoute permission={PERMISSIONS.REFUND.READ}><Refunds /></ProtectedRoute>} />
        <Route path="/refunds/:id" element={<ProtectedRoute permission={PERMISSIONS.REFUND.READ}><RefundDetails /></ProtectedRoute>} />

        {/* Customers */}
        <Route path="/customers" element={<ProtectedRoute permission={PERMISSIONS.CUSTOMER.READ}><Customers /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute permission={PERMISSIONS.CUSTOMER.READ}><CustomerDetails /></ProtectedRoute>} />

        {/* Warehouses */}
        <Route path="/warehouses" element={<ProtectedRoute permission={PERMISSIONS.WAREHOUSE.READ}><WarehouseDashboard /></ProtectedRoute>} />
        <Route path="/warehouses/new" element={<ProtectedRoute permission={PERMISSIONS.WAREHOUSE.CREATE}><CreateWarehouse /></ProtectedRoute>} />
        <Route path="/warehouses/:id" element={<ProtectedRoute permission={PERMISSIONS.WAREHOUSE.READ}><WarehouseDetails /></ProtectedRoute>} />

        {/* Purchase Orders */}
        <Route path="/purchase-orders" element={<ProtectedRoute permission={PERMISSIONS.PURCHASE_ORDER.READ}><PurchaseOrders /></ProtectedRoute>} />
        <Route path="/purchase-orders/:id" element={<ProtectedRoute permission={PERMISSIONS.PURCHASE_ORDER.READ}><PurchaseOrderDetails /></ProtectedRoute>} />

        {/* Quotes */}
        <Route path="/quotes" element={<ProtectedRoute permission={PERMISSIONS.QUOTE.READ}><Quotes /></ProtectedRoute>} />
        <Route path="/quotes/:id" element={<ProtectedRoute permission={PERMISSIONS.QUOTE.READ}><QuoteDetails /></ProtectedRoute>} />

        {/* Sales Orders */}
        <Route path="/sales-orders" element={<Navigate to="/orders" replace />} />
        <Route path="/sales-orders/:id" element={<RedirectWithParams to="/orders/:id" />} />
        <Route path="/orders" element={<ProtectedRoute permission={PERMISSIONS.SALES_ORDER.READ}><SalesOrders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute permission={PERMISSIONS.SALES_ORDER.READ}><OrderDetails /></ProtectedRoute>} />

        {/* Suppliers */}
        <Route path="/suppliers" element={<ProtectedRoute permission={PERMISSIONS.SUPPLIER.READ}><Suppliers /></ProtectedRoute>} />
        <Route path="/suppliers/:id" element={<ProtectedRoute permission={PERMISSIONS.SUPPLIER.READ}><SupplierDetails /></ProtectedRoute>} />

        {/* Goods Receipts */}
        <Route path="/goods-receipts" element={<ProtectedRoute permission={PERMISSIONS.GOODS_RECEIPT.READ}><GoodsReceiptDashboard /></ProtectedRoute>} />
        <Route path="/goods-receipts/create" element={<ProtectedRoute permission={PERMISSIONS.GOODS_RECEIPT.CREATE}><CreateGoodsReceipt /></ProtectedRoute>} />
        <Route path="/goods-receipts/:id" element={<ProtectedRoute permission={PERMISSIONS.GOODS_RECEIPT.READ}><GoodsReceiptDetails /></ProtectedRoute>} />

        {/* ✅ Redirect /reports to /reports/sales */}
        <Route path="/reports" element={<Navigate to="/reports/sales" replace />} />
<Route
  path="/reports/inventory"
  element={
    <ProtectedRoute permission={PERMISSIONS.REPORT.INVENTORY}>
      <InventoryReport />
    </ProtectedRoute>
  }
/>
        {/* ✅ Sales Report */}
        <Route path="/reports/sales" element={<ProtectedRoute permission={PERMISSIONS.REPORT.SALES}><SalesReport /></ProtectedRoute>} />
        <Route
  path="/reports/financial"
  element={
    <ProtectedRoute permission={PERMISSIONS.REPORT.FINANCIAL}>
      <FinancialReport />
    </ProtectedRoute>
  }
/>

      </Route>

    </Routes>
  );
}