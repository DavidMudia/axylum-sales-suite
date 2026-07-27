"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
async function getDashboard() {
    const [pendingQuotes, pendingPayments, overdueInvoices, lowStockProducts, recentCustomers, recentQuotes, recentInvoices, recentPayments,] = await Promise.all([
        prisma_1.default.quote.count({
            where: {
                status: client_1.QuoteStatus.DRAFT,
                isDeleted: false,
            },
        }),
        prisma_1.default.payment.count({
            where: {
                status: client_1.PaymentStatus.PENDING,
            },
        }),
        prisma_1.default.invoice.count({
            where: {
                status: client_1.InvoiceStatus.OVERDUE,
                isDeleted: false,
            },
        }),
        prisma_1.default.inventory.findMany({
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
        prisma_1.default.customer.findMany({
            where: {
                isDeleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        prisma_1.default.quote.findMany({
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
        prisma_1.default.invoice.findMany({
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
        prisma_1.default.payment.findMany({
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
