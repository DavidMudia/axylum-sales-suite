// src/components/layout/navigation.ts
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  Truck,
  RotateCcw,
  ClipboardCheck,
  Warehouse,
  ClipboardList,
  Boxes,
  UserCog,
  Shield,
  Settings,
  BarChart3,
  Receipt,
} from "lucide-react";

import { PERMISSIONS } from "../../constants/permissions";

export interface NavigationItem {
  title: string;
  icon: any;
  path?: string;
  permission?: string;
  children?: NavigationItem[];
}

export const navigation: NavigationItem[] = [
  {
    title: "General",
    icon: LayoutDashboard,
    children: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },

  {
    title: "Sales",
    icon: ShoppingCart,
    children: [
      {
        title: "Quotes",
        path: "/quotes",
        icon: FileText,
        permission: PERMISSIONS.QUOTE.READ,
      },
      {
        title: "Sales Orders",
        path: "/orders",
        icon: ClipboardList,
        permission: PERMISSIONS.SALES_ORDER.READ,
      },
      {
        title: "Invoices",
        path: "/invoices",
        icon: Receipt,
        permission: PERMISSIONS.INVOICE.READ,
      },
      {
        title: "Payments",
        path: "/payments",
        icon: CreditCard,
        permission: PERMISSIONS.PAYMENT.READ,
      },
      {
        title: "Refunds",
        path: "/refunds",
        icon: RotateCcw,
        permission: PERMISSIONS.REFUND.READ,
      },
    ],
  },

  {
    title: "Inventory",
    icon: Boxes,
    children: [
      {
        title: "Products",
        path: "/products",
        icon: Package,
        permission: PERMISSIONS.INVENTORY.READ,
      },
      {
        title: "Warehouses",
        path: "/warehouses",
        icon: Warehouse,
        permission: PERMISSIONS.WAREHOUSE.READ,
      },
      {
        title: "Goods Receipts",
        path: "/goods-receipts",
        icon: ClipboardCheck,
        permission: PERMISSIONS.GOODS_RECEIPT.READ,
      },
    ],
  },

  {
    title: "Purchasing",
    icon: ShoppingCart,
    children: [
      {
        title: "Suppliers",
        path: "/suppliers",
        icon: Truck,
        permission: PERMISSIONS.SUPPLIER.READ,
      },
      {
        title: "Purchase Orders",
        path: "/purchase-orders",
        icon: FileText,
        permission: PERMISSIONS.PURCHASE_ORDER.READ,
      },
    ],
  },

  {
    title: "Logistics",
    icon: Truck,
    children: [
      {
        title: "Waybills",
        path: "/waybills",
        icon: Truck,
        permission: PERMISSIONS.WAYBILL.READ,
      },
    ],
  },

  {
    title: "Customers",
    icon: Users,
    children: [
      {
        title: "Customers",
        path: "/customers",
        icon: Users,
        permission: PERMISSIONS.CUSTOMER.READ,
      },
    ],
  },

  {
  title: "Reports",
  icon: BarChart3,
  children: [
    {
      title: "Sales Report",
      path: "/reports/sales",
      icon: BarChart3,
      permission: PERMISSIONS.REPORT.SALES,
    },
    {
      title: "Inventory Report",
      path: "/reports/inventory",
      icon: Boxes,
      permission: PERMISSIONS.REPORT.INVENTORY,
    },
    {
  title: "Financial Report",
  path: "/reports/financial",
  icon: Receipt,
  permission: PERMISSIONS.REPORT.FINANCIAL,
},
{
  title: "Expenses",
  path: "/expenses",
  icon: CreditCard,
  permission: PERMISSIONS.EXPENSES.READ,
},
  ],
  
},
  {
    title: "Administration",
    icon: Shield,
    children: [
      {
        title: "Users",
        path: "/users",
        icon: UserCog,
        permission: PERMISSIONS.USER.READ,
      },
      {
        title: "Roles",
        path: "/roles",
        icon: Shield,
        permission: PERMISSIONS.ROLE.READ,
      },
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
        permission: PERMISSIONS.USER.UPDATE,
      },
    ],
  },
];