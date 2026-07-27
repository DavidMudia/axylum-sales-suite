import prisma from "../../lib/prisma";

import {
  InvoiceStatus,
  PaymentStatus,
  PurchaseOrderStatus,
  RefundStatus,
  WaybillStatus,
} from "@prisma/client";

export async function getDashboard() {
  const [
  customers,
  suppliers,
  products,
  invoices,
  salesOrders,
  purchaseOrders,
  payments,
  refunds,
  waybills,

  pendingPurchaseOrders,
  pendingRefunds,
  pendingWaybills,

  inventory,

  revenue,

  paymentTotal,

  recentOrders,
  recentInvoices,
  recentPayments,
  recentActivity,
]  = await Promise.all([
    prisma.customer.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.supplier.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.product.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.invoice.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.salesOrder.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.purchaseOrder.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.payment.count(),

    prisma.refund.count(),

    prisma.waybill.count(),

    prisma.purchaseOrder.count({
      where: {
        status: PurchaseOrderStatus.PENDING_APPROVAL,
        isDeleted: false,
      },
    }),

    prisma.refund.count({
      where: {
        status: RefundStatus.PENDING,
      },
    }),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.PENDING,
      },
    }),

    prisma.inventory.findMany({
      include: {
        product: true,
      },
    }),

    prisma.invoice.aggregate({
      where: {
        status: InvoiceStatus.PAID,
      },
      _sum: {
        total: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.salesOrder.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
      },
    }),

    prisma.invoice.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
      },
    }),

    prisma.payment.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.auditLog.findMany({
  take: 10,
  orderBy: {
    createdAt: "desc",
  },
}),
  ]);

  const lowStockProducts = inventory.filter(
    (item) =>
      Number(item.quantity) <= Number(item.product.minimumStock)
  );

  const lowStock = lowStockProducts.length;

  const inventoryValue = inventory.reduce(
    (sum: number, item) =>
      sum +
      Number(item.quantity) *
        Number(item.product.costPrice),
    0
  );

  // Temporary until we build proper monthly analytics
  const revenueTrend = [
    {
      month: "Jan",
      revenue: 0,
    },
    {
      month: "Feb",
      revenue: 0,
    },
    {
      month: "Mar",
      revenue: 0,
    },
    {
      month: "Apr",
      revenue: 0,
    },
    {
      month: "May",
      revenue: 0,
    },
    {
      month: "Jun",
      revenue: Number(revenue._sum.total ?? 0),
    },
  ];

  return {
    cards: {
      customers,
      suppliers,
      products,
      invoices,
      salesOrders,
      purchaseOrders,
      payments,
      refunds,
      waybills,

      revenue: revenue._sum.total ?? 0,

      paymentsReceived:
        paymentTotal._sum.amount ?? 0,

      inventoryValue,
    },

    alerts: {
      lowStock,
      pendingPurchaseOrders,
      pendingRefunds,
      pendingWaybills,
    },
recentActivity,
    recentOrders,

    recentInvoices,

    recentPayments,

    lowStockProducts: lowStockProducts.map((item) => ({
  id: item.product.id,
  name: item.product.name,
  quantity: Number(item.quantity),
  minimumStock: Number(item.product.minimumStock),
})),

    revenueTrend,
  };
}