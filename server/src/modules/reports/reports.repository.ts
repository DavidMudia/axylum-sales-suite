import { z } from "zod";
import prisma from "../../lib/prisma";

import {
  InvoiceStatus,
  PaymentStatus,
  RefundStatus,
  PurchaseOrderStatus,
  GoodsReceiptStatus,
  WaybillStatus,
} from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Date Range
|--------------------------------------------------------------------------
*/

export const reportQuerySchema = z.object({
  startDate: z.string().datetime().optional(),

  endDate: z.string().datetime().optional(),

  customerId: z.coerce.number().int().positive().optional(),

  supplierId: z.coerce.number().int().positive().optional(),

  warehouseId: z.coerce.number().int().positive().optional(),

  salespersonId: z.coerce.number().int().positive().optional(),
});

export async function dashboard() {

  const [

    totalCustomers,

    totalSuppliers,

    totalProducts,

    totalInvoices,

    totalSalesOrders,

    totalPurchaseOrders,

    totalPayments,

    totalRefunds,

    totalWaybills,

    pendingPurchaseOrders,

    pendingRefunds,

    pendingWaybills,

    inventory,

    paidInvoices,

    completedPayments,

  ] = await Promise.all([

    prisma.customer.count(),

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

    prisma.invoice.count(),

    prisma.salesOrder.count(),

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

  ]);

  const lowStockItems =
    inventory.filter(

      item =>

        Number(item.quantity) <=
        Number(item.product.minimumStock)

    ).length;

  const inventoryValue =
    inventory.reduce(

      (
        sum: number,
        item: typeof inventory[number]
      ) =>

        sum +
        Number(item.quantity) *
        Number(item.product.costPrice),

      0

    );

  return {

    totalCustomers,

    totalSuppliers,

    totalProducts,

    totalInvoices,

    totalSalesOrders,

    totalPurchaseOrders,

    totalPayments,

    totalRefunds,

    totalWaybills,

    pendingPurchaseOrders,

    pendingRefunds,

    pendingWaybills,

    lowStockItems,

    inventoryValue,

    totalSales:
      paidInvoices._sum.total ?? 0,

    totalPaymentsReceived:
      completedPayments._sum.amount ?? 0,

  };
}
export async function salesSummary() {

  const [

    invoices,

    orders,

    paid,

    unpaid,

  ] = await Promise.all([

    prisma.invoice.aggregate({
      _sum: {
        total: true,
      },
    }),

    prisma.salesOrder.count(),

    prisma.invoice.count({
      where: {
        status: InvoiceStatus.PAID,
      },
    }),

    prisma.invoice.count({
      where: {
        status: {
          not: InvoiceStatus.PAID,
        },
      },
    }),

  ]);

  return {

    totalSales:
      invoices._sum.total ?? 0,

    totalOrders: orders,

    paidInvoices: paid,

    unpaidInvoices: unpaid,

  };

}
export async function purchaseSummary() {

  const purchases =
    await prisma.purchaseOrder.aggregate({

      _sum: {
        total: true,
      },

    });

  return {

    totalPurchases:
      purchases._sum.total ?? 0,

  };

}
export async function inventorySummary() {

  const inventory =
    await prisma.inventory.findMany({

      include: {
        product: true,
      },

    });

  const totalValue =
  inventory.reduce(

    (
      sum: number,
      item: typeof inventory[number]
    ) =>

      sum +
      Number(item.quantity) *
      Number(item.product.costPrice),

    0

  );

  return {

    totalItems:
      inventory.length,

    inventoryValue:
      totalValue,

  };

}
export async function paymentSummary() {

  return prisma.payment.aggregate({

    where: {
      status: PaymentStatus.COMPLETED,
    },

    _sum: {
      amount: true,
    },

  });

}
export async function refundSummary() {

  return prisma.refund.aggregate({

    where: {
      status: RefundStatus.APPROVED,
    },

    _sum: {
      amount: true,
    },

  });

}