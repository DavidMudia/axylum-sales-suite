"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.getAll = getAll;
exports.findById = findById;
exports.update = update;
exports.softDelete = softDelete;
exports.restore = restore;
exports.approve = approve;
exports.markPrinted = markPrinted;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
function create(data) {
    return prisma_1.default.invoice.create({
        data,
        include: {
            customer: true,
            createdBy: { select: { id: true, firstName: true, lastName: true } },
            approvedBy: { select: { id: true, firstName: true, lastName: true } },
            items: { include: { product: true } },
            payments: true,
            salesOrder: true, // ✅ added
            waybills: true,
        },
    });
}
function getAll(search, status, page = 1, limit = 20) {
    return prisma_1.default.invoice.findMany({
        where: {
            isDeleted: false,
            ...(status && {
                status,
            }),
            ...(search && {
                OR: [
                    {
                        invoiceNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        verificationCode: {
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
                    {
                        customer: {
                            phone: {
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
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            payments: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
}
function findById(id) {
    return prisma_1.default.invoice.findFirst({
        where: { id, isDeleted: false },
        include: {
            customer: true,
            createdBy: true,
            approvedBy: true,
            items: { include: { product: true } },
            payments: true,
            waybills: true,
            refunds: true,
            salesOrder: true, // ✅ added
        },
    });
}
function update(id, data) {
    return prisma_1.default.invoice.update({
        where: {
            id,
        },
        data,
        include: {
            customer: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function softDelete(id) {
    return prisma_1.default.invoice.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
}
function restore(id) {
    return prisma_1.default.invoice.update({
        where: {
            id,
        },
        data: {
            isDeleted: false,
        },
    });
}
function approve(id, userId, note) {
    return prisma_1.default.invoice.update({
        where: {
            id,
        },
        data: {
            approvedBy: {
                connect: {
                    id: userId,
                },
            },
            approvedAt: new Date(),
            approvalNote: note,
        },
    });
}
function markPrinted(id) {
    return prisma_1.default.invoice.update({
        where: {
            id,
        },
        data: {
            isPrinted: true,
            printedAt: new Date(),
        },
    });
}
function getStats() {
    return Promise.all([
        prisma_1.default.invoice.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.invoice.count({
            where: {
                status: "UNPAID",
                isDeleted: false,
            },
        }),
        prisma_1.default.invoice.count({
            where: {
                status: "PARTIAL",
                isDeleted: false,
            },
        }),
        prisma_1.default.invoice.count({
            where: {
                status: "PAID",
                isDeleted: false,
            },
        }),
        prisma_1.default.invoice.aggregate({
            where: {
                isDeleted: false,
            },
            _sum: {
                total: true,
            },
        }),
    ]).then(([totalInvoices, unpaid, partial, paid, totals,]) => ({
        totalInvoices,
        unpaid,
        partial,
        paid,
        totalRevenue: totals._sum.total ?? 0,
    }));
}
