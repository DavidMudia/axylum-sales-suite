"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
async function getDashboard() {
    const [customers, suppliers, products, invoices, salesOrders, purchaseOrders, payments, refunds, waybills, pendingPurchaseOrders, pendingRefunds, pendingWaybills, inventory, revenue, paymentTotal, recentOrders, recentInvoices, recentPayments, recentActivity,] = await Promise.all([
        prisma_1.default.customer.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.supplier.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.product.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.invoice.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.purchaseOrder.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.payment.count(),
        prisma_1.default.refund.count(),
        prisma_1.default.waybill.count(),
        prisma_1.default.purchaseOrder.count({
            where: {
                status: client_1.PurchaseOrderStatus.PENDING_APPROVAL,
                isDeleted: false,
            },
        }),
        prisma_1.default.refund.count({
            where: {
                status: client_1.RefundStatus.PENDING,
            },
        }),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.PENDING,
            },
        }),
        prisma_1.default.inventory.findMany({
            include: {
                product: true,
            },
        }),
        prisma_1.default.invoice.aggregate({
            where: {
                status: client_1.InvoiceStatus.PAID,
            },
            _sum: {
                total: true,
            },
        }),
        prisma_1.default.payment.aggregate({
            where: {
                status: client_1.PaymentStatus.COMPLETED,
            },
            _sum: {
                amount: true,
            },
        }),
        prisma_1.default.salesOrder.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customer: true,
            },
        }),
        prisma_1.default.invoice.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customer: true,
            },
        }),
        prisma_1.default.payment.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.default.auditLog.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        }),
    ]);
    const lowStockProducts = inventory.filter((item) => Number(item.quantity) <= Number(item.product.minimumStock));
    const lowStock = lowStockProducts.length;
    const inventoryValue = inventory.reduce((sum, item) => sum +
        Number(item.quantity) *
            Number(item.product.costPrice), 0);
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
            paymentsReceived: paymentTotal._sum.amount ?? 0,
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
