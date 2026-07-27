"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.findByOrderNumber = findByOrderNumber;
exports.getAll = getAll;
exports.update = update;
exports.deleteOrder = deleteOrder;
exports.updateStatus = updateStatus;
exports.restore = restore;
exports.findDeletedById = findDeletedById;
exports.approve = approve;
exports.cancel = cancel;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
function create(data) {
    return prisma_1.default.salesOrder.create({
        data,
        include: {
            customer: true,
            createdBy: true,
            quote: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function findById(id) {
    return prisma_1.default.salesOrder.findFirst({
        where: { id },
        include: {
            customer: true,
            createdBy: true,
            quote: true,
            items: { include: { product: true } },
            invoice: true, // ✅ Add this line
        },
    });
}
function findByOrderNumber(orderNumber) {
    return prisma_1.default.salesOrder.findUnique({
        where: {
            orderNumber,
        },
    });
}
function getAll(search, status, customerId, page = 1, limit = 20) {
    return prisma_1.default.salesOrder.findMany({
        where: {
            isDeleted: false,
            ...(status && {
                status,
            }),
            ...(customerId && {
                customerId,
            }),
            ...(search && {
                OR: [
                    {
                        orderNumber: {
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
            quote: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
}
function update(id, data) {
    return prisma_1.default.salesOrder.update({
        where: {
            id,
        },
        data,
        include: {
            customer: true,
            createdBy: true,
            quote: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function deleteOrder(id) {
    return prisma_1.default.salesOrder.delete({
        where: {
            id,
        },
    });
}
function updateStatus(id, status) {
    return prisma_1.default.salesOrder.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
}
function restore(id) {
    return prisma_1.default.salesOrder.update({
        where: { id },
        data: {
            isDeleted: false,
        },
    });
}
function findDeletedById(id) {
    return prisma_1.default.salesOrder.findFirst({
        where: {
            id,
            isDeleted: true,
        },
    });
}
function approve(id, userId) {
    return prisma_1.default.salesOrder.update({
        where: { id },
        data: {
            status: "APPROVED",
            approvedBy: {
                connect: {
                    id: userId,
                },
            },
            approvedAt: new Date(),
        },
    });
}
function cancel(id, userId, reason) {
    return prisma_1.default.salesOrder.update({
        where: { id },
        data: {
            status: "CANCELLED",
            cancelledBy: {
                connect: {
                    id: userId,
                },
            },
            cancelledAt: new Date(),
            cancellationReason: reason,
        },
    });
}
async function getStats() {
    const [totalOrders, pending, approved, processing, readyForLoading, loaded, dispatched, delivered, cancelled,] = await Promise.all([
        prisma_1.default.salesOrder.count(),
        prisma_1.default.salesOrder.count({
            where: {
                status: "PENDING",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "APPROVED",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "PROCESSING",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "READY_FOR_LOADING",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "LOADED",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "DISPATCHED",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "DELIVERED",
            },
        }),
        prisma_1.default.salesOrder.count({
            where: {
                status: "CANCELLED",
            },
        }),
    ]);
    return {
        totalOrders,
        pending,
        approved,
        processing,
        readyForLoading,
        loaded,
        dispatched,
        delivered,
        cancelled,
    };
}
