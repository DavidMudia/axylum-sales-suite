export const PERMISSIONS = {
    DASHBOARD: {
        VIEW: "dashboard.view",
    },

    CUSTOMER: {
        CREATE: "customer.create",
        READ: "customer.read",
        UPDATE: "customer.update",
        DELETE: "customer.delete",
    },

    SUPPLIER: {
        CREATE: "supplier.create",
        READ: "supplier.read",
        UPDATE: "supplier.update",
        DELETE: "supplier.delete",
    },

    PRODUCT: {
        CREATE: "product.create",
        READ: "product.read",
        UPDATE: "product.update",
        DELETE: "product.delete",
    },

    WAREHOUSE: {
        CREATE: "warehouse.create",
        READ: "warehouse.read",
        UPDATE: "warehouse.update",
        DELETE: "warehouse.delete",
    },

    INVENTORY: {
        READ: "inventory.read",
        UPDATE: "inventory.update",
        ADJUST: "inventory.adjust",
    },

    GOODS_RECEIPT: {
        CREATE: "goods-receipt.create",
        READ: "goods-receipt.read",
        APPROVE: "goods-receipt.approve",
    },
 PURCHASE_ORDER: {
    READ: 'purchase_order.read',
    CREATE: 'purchase_order.create',
    UPDATE: 'purchase_order.update',
    DELETE: 'purchase_order.delete',
    APPROVE: 'purchase_order.approve',
  },
    QUOTE: {
        CREATE: "quote.create",
        READ: "quote.read",
        APPROVE: "quote.approve",
        REJECT: "quote.reject",
    },

    SALES_ORDER: {
        CREATE: "sales-order.create",
        READ: "sales-order.read",
        APPROVE: "sales-order.approve",
        CANCEL: "sales-order.cancel",
    },

    INVOICE: {
        CREATE: "invoice.create",
        READ: "invoice.read",
        APPROVE: "invoice.approve",
        PRINT: "invoice.print",
    },

    PAYMENT: {
        CREATE: "payment.create",
        READ: "payment.read",
        APPROVE: "payment.approve",
        CANCEL: "payment.cancel",
    },

    REFUND: {
        CREATE: "refund.create",
        READ: "refund.read",
        APPROVE: "refund.approve",
        REJECT: "refund.reject",
    },

    WAYBILL: {
        CREATE: "waybill.create",
        READ: "waybill.read",
        PRINT: "waybill.print",
         UPDATE: 'waybill.update',
    },

    REPORT: {
        SALES: "report.sales",
        INVENTORY: "report.inventory",
        FINANCIAL: "report.financial",
    },

    USER: {
        CREATE: "user.create",
        READ: "user.read",
        UPDATE: "user.update",
        DELETE: "user.delete",
    },

    ROLE: {
        CREATE: "role.create",
        READ: "role.read",
        UPDATE: "role.update",
        DELETE: "role.delete",
    },

    SETTINGS: {
        READ: "settings.read",
        UPDATE: "settings.update",
    },
    EXPENSES: {
  CREATE: 'expenses.create',
  READ: 'expenses.read',
  UPDATE: 'expenses.update',
  DELETE: 'expenses.delete',
},
} as const;