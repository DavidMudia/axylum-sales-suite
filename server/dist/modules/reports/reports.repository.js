"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQuerySchema = void 0;
exports.dashboard = dashboard;
exports.salesSummary = salesSummary;
exports.purchaseSummary = purchaseSummary;
exports.inventorySummary = inventorySummary;
exports.paymentSummary = paymentSummary;
exports.refundSummary = refundSummary;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Date Range
|--------------------------------------------------------------------------
*/
exports.reportQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    customerId: zod_1.z.coerce.number().int().positive().optional(),
    supplierId: zod_1.z.coerce.number().int().positive().optional(),
    warehouseId: zod_1.z.coerce.number().int().positive().optional(),
    salespersonId: zod_1.z.coerce.number().int().positive().optional(),
});
async function dashboard() {
    const [totalCustomers, totalSuppliers, totalProducts, totalInvoices, totalSalesOrders, totalPurchaseOrders, totalPayments, totalRefunds, totalWaybills, pendingPurchaseOrders, pendingRefunds, pendingWaybills, inventory, paidInvoices, completedPayments,] = await Promise.all([
        prisma_1.default.customer.count(),
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
        prisma_1.default.invoice.count(),
        prisma_1.default.salesOrder.count(),
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
    ]);
    const lowStockItems = inventory.filter(item => Number(item.quantity) <=
        Number(item.product.minimumStock)).length;
    const inventoryValue = inventory.reduce((sum, item) => sum +
        Number(item.quantity) *
            Number(item.product.costPrice), 0);
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
        totalSales: paidInvoices._sum.total ?? 0,
        totalPaymentsReceived: completedPayments._sum.amount ?? 0,
    };
}
async function salesSummary() {
    const [invoices, orders, paid, unpaid,] = await Promise.all([
        prisma_1.default.invoice.aggregate({
            _sum: {
                total: true,
            },
        }),
        prisma_1.default.salesOrder.count(),
        prisma_1.default.invoice.count({
            where: {
                status: client_1.InvoiceStatus.PAID,
            },
        }),
        prisma_1.default.invoice.count({
            where: {
                status: {
                    not: client_1.InvoiceStatus.PAID,
                },
            },
        }),
    ]);
    return {
        totalSales: invoices._sum.total ?? 0,
        totalOrders: orders,
        paidInvoices: paid,
        unpaidInvoices: unpaid,
    };
}
async function purchaseSummary() {
    const purchases = await prisma_1.default.purchaseOrder.aggregate({
        _sum: {
            total: true,
        },
    });
    return {
        totalPurchases: purchases._sum.total ?? 0,
    };
}
async function inventorySummary() {
    const inventory = await prisma_1.default.inventory.findMany({
        include: {
            product: true,
        },
    });
    const totalValue = inventory.reduce((sum, item) => sum +
        Number(item.quantity) *
            Number(item.product.costPrice), 0);
    return {
        totalItems: inventory.length,
        inventoryValue: totalValue,
    };
}
async function paymentSummary() {
    return prisma_1.default.payment.aggregate({
        where: {
            status: client_1.PaymentStatus.COMPLETED,
        },
        _sum: {
            amount: true,
        },
    });
}
async function refundSummary() {
    return prisma_1.default.refund.aggregate({
        where: {
            status: client_1.RefundStatus.APPROVED,
        },
        _sum: {
            amount: true,
        },
    });
}
