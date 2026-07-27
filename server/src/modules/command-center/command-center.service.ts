import prisma from "../../lib/prisma";
import {
  PaymentStatus,
  QuoteStatus,
  InvoiceStatus,
} from "@prisma/client";

export async function getDashboard() {
  const [
    pendingQuotes,
    pendingPayments,
    overdueInvoices,
    lowStockProducts,
    recentCustomers,
    recentQuotes,
    recentInvoices,
    recentPayments,
  ] = await Promise.all([
    prisma.quote.count({
      where: {
        status: QuoteStatus.DRAFT,
        isDeleted: false,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.PENDING,
      },
    }),

    prisma.invoice.count({
      where: {
        status: InvoiceStatus.OVERDUE,
        isDeleted: false,
      },
    }),

    prisma.inventory.findMany({
      where: {
        quantity: {
          lte: 10,
        },
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: {
        quantity: "asc",
      },
      take: 5,
    }),

    prisma.customer.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.quote.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.invoice.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.payment.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    alerts: {
      pendingQuotes,
      pendingPayments,
      overdueInvoices,
      lowStock: lowStockProducts.length,
    },

    lowStockProducts,

    recentCustomers,

    recentQuotes,

    recentInvoices,

    recentPayments,
  };
}