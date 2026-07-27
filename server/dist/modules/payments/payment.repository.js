"use strict";
// server/src/modules/payments/payment.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.getAll = getAll;
exports.update = update;
exports.approve = approve;
exports.cancel = cancel;
exports.getStats = getStats;
exports.count = count;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
function create(db, data) {
    return db.payment.create({
        data,
        include: {
            customer: true,
            invoice: true,
            createdBy: true,
            approvedBy: true,
        },
    });
}
function findById(id) {
    return prisma_1.default.payment.findFirst({
        where: { id },
        include: {
            customer: true,
            invoice: {
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
            createdBy: true,
            approvedBy: true,
            cancelledBy: true,
        },
    });
}
function getAll(search, status, method, customerId, refundable = false, page = 1, limit = 20) {
    return prisma_1.default.payment.findMany({
        where: {
            ...(status && {
                status,
            }),
            ...(method && {
                paymentMethod: method,
            }),
            ...(customerId && {
                customerId,
            }),
            // Only payments that can still be refunded
            ...(refundable && {
                status: client_1.PaymentStatus.COMPLETED,
                amount: {
                    gt: prisma_1.default.payment.fields.refundedAmount,
                },
            }),
            ...(search && {
                OR: [
                    {
                        paymentNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        receiptNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        transactionId: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customer: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        },
        include: {
            customer: true,
            invoice: true,
            approvedBy: true,
            createdBy: true,
            cancelledBy: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
}
function update(id, data) {
    return prisma_1.default.payment.update({
        where: {
            id,
        },
        data,
        include: {
            customer: true,
            invoice: true,
            approvedBy: true,
            createdBy: true,
            cancelledBy: true,
        },
    });
}
function approve(id, userId) {
    return prisma_1.default.payment.update({
        where: {
            id,
        },
        data: {
            status: client_1.PaymentStatus.COMPLETED,
            approvedAt: new Date(),
            approvedBy: {
                connect: {
                    id: userId,
                },
            },
        },
        include: {
            customer: true,
            invoice: true,
            approvedBy: true,
            createdBy: true,
        },
    });
}
function cancel(id) {
    return prisma_1.default.payment.update({
        where: {
            id,
        },
        data: {
            status: client_1.PaymentStatus.CANCELLED,
        },
    });
}
async function getStats() {
    const [totalPayments, completedPayments, pendingPayments, failedPayments, cancelledPayments, totalAmount,] = await Promise.all([
        prisma_1.default.payment.count(),
        prisma_1.default.payment.count({
            where: {
                status: client_1.PaymentStatus.COMPLETED,
            },
        }),
        prisma_1.default.payment.count({
            where: {
                status: client_1.PaymentStatus.PENDING,
            },
        }),
        prisma_1.default.payment.count({
            where: {
                status: client_1.PaymentStatus.FAILED,
            },
        }),
        prisma_1.default.payment.count({
            where: {
                status: client_1.PaymentStatus.CANCELLED,
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
    return {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        cancelledPayments,
        totalRevenue: Number(totalAmount._sum.amount ?? 0),
    };
}
function count(search, status, method, customerId, refundable = false) {
    return prisma_1.default.payment.count({
        where: {
            ...(status && { status }),
            ...(method && { paymentMethod: method }),
            ...(customerId && { customerId }),
            ...(refundable && {
                status: client_1.PaymentStatus.COMPLETED,
                amount: {
                    gt: prisma_1.default.payment.fields.refundedAmount,
                },
            }),
            ...(search && {
                OR: [
                    {
                        paymentNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        receiptNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        transactionId: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customer: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        },
    });
}
