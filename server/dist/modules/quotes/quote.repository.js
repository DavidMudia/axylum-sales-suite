"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.findByQuoteNumber = findByQuoteNumber;
exports.getAll = getAll;
exports.update = update;
exports.softDelete = softDelete;
exports.approve = approve;
exports.reject = reject;
exports.getStats = getStats;
exports.restore = restore;
const prisma_1 = __importDefault(require("../../lib/prisma"));
function create(data) {
    return prisma_1.default.quote.create({
        data,
        include: {
            customer: true,
            createdBy: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function findById(id) {
    return prisma_1.default.quote.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            customer: true,
            createdBy: true,
            approvedBy: true,
            rejectedBy: true,
            salesOrders: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function findByQuoteNumber(quoteNumber) {
    return prisma_1.default.quote.findFirst({
        where: {
            quoteNumber,
            isDeleted: false,
        },
    });
}
function getAll(search, status, page = 1, limit = 20) {
    return prisma_1.default.quote.findMany({
        where: {
            isDeleted: false,
            ...(status && {
                status: status,
            }),
            ...(search && {
                OR: [
                    {
                        quoteNumber: {
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
                            companyName: {
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
            createdBy: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
}
function update(id, data) {
    return prisma_1.default.quote.update({
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
    return prisma_1.default.quote.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
}
function approve(id, approvedById) {
    return prisma_1.default.quote.update({
        where: {
            id,
        },
        data: {
            status: "ACCEPTED",
            approvedAt: new Date(),
            approvedBy: {
                connect: {
                    id: approvedById,
                },
            },
        },
    });
}
function reject(id, rejectedById, note) {
    return prisma_1.default.quote.update({
        where: {
            id,
        },
        data: {
            status: "REJECTED",
            rejectedAt: new Date(),
            approvalNote: note,
            rejectedBy: {
                connect: {
                    id: rejectedById,
                },
            },
        },
    });
}
function getStats() {
    return Promise.all([
        prisma_1.default.quote.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.quote.count({
            where: {
                status: "DRAFT",
                isDeleted: false,
            },
        }),
        prisma_1.default.quote.count({
            where: {
                status: "SENT",
                isDeleted: false,
            },
        }),
        prisma_1.default.quote.count({
            where: {
                status: "ACCEPTED",
                isDeleted: false,
            },
        }),
        prisma_1.default.quote.count({
            where: {
                status: "REJECTED",
                isDeleted: false,
            },
        }),
        prisma_1.default.quote.aggregate({
            where: {
                isDeleted: false,
            },
            _sum: {
                total: true,
            },
        }),
    ]).then(([totalQuotes, draftQuotes, sentQuotes, acceptedQuotes, rejectedQuotes, totalValue,]) => ({
        totalQuotes,
        draftQuotes,
        sentQuotes,
        acceptedQuotes,
        rejectedQuotes,
        totalValue: totalValue._sum.total ?? 0,
    }));
}
function restore(id) {
    return prisma_1.default.quote.update({
        where: { id },
        data: {
            isDeleted: false,
        },
    });
}
