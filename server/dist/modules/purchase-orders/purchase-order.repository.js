"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.findAll = findAll;
exports.count = count;
exports.update = update;
exports.softDelete = softDelete;
exports.restore = restore;
exports.approve = approve;
exports.cancel = cancel;
exports.getStats = getStats;
// server/src/modules/purchase-orders/purchase-order.repository.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
function create(data) {
    return prisma_1.default.purchaseOrder.create({
        data,
        include: {
            supplier: true,
            warehouse: true,
            createdBy: true,
            approvedBy: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function findById(id) {
    return prisma_1.default.purchaseOrder.findUnique({
        where: { id },
        include: {
            supplier: true,
            warehouse: true,
            createdBy: true,
            approvedBy: true,
            cancelledBy: true,
            items: {
                include: {
                    product: true,
                },
            },
            goodsReceipts: {
                select: {
                    id: true,
                    receiptNumber: true,
                },
            },
        },
    });
}
function findAll(search, status, supplierId, page = 1, limit = 20) {
    return prisma_1.default.purchaseOrder.findMany({
        where: {
            isDeleted: false,
            ...(status && { status }),
            ...(supplierId && { supplierId }),
            ...(search && {
                OR: [
                    {
                        purchaseOrderNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        supplier: {
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
            supplier: true,
            warehouse: true,
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
function count(search, status, supplierId) {
    return prisma_1.default.purchaseOrder.count({
        where: {
            isDeleted: false,
            ...(status && { status }),
            ...(supplierId && { supplierId }),
            ...(search && {
                OR: [
                    {
                        purchaseOrderNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        supplier: {
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
function update(id, data) {
    return prisma_1.default.purchaseOrder.update({
        where: { id },
        data,
        include: {
            supplier: true,
            warehouse: true,
            createdBy: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function softDelete(id) {
    return prisma_1.default.purchaseOrder.update({
        where: { id },
        data: { isDeleted: true },
    });
}
function restore(id) {
    return prisma_1.default.purchaseOrder.update({
        where: { id },
        data: { isDeleted: false },
    });
}
function approve(id, userId) {
    return prisma_1.default.purchaseOrder.update({
        where: { id },
        data: {
            status: "APPROVED",
            approvedById: userId,
            approvedAt: new Date(),
        },
        include: {
            supplier: true,
            warehouse: true,
            createdBy: true,
            approvedBy: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
function cancel(id, userId, reason) {
    return prisma_1.default.purchaseOrder.update({
        where: { id },
        data: {
            status: "CANCELLED",
            cancelledById: userId,
            cancelledAt: new Date(),
            cancellationReason: reason,
        },
        include: {
            supplier: true,
            warehouse: true,
            createdBy: true,
            cancelledBy: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
}
async function getStats() {
    const [totalOrders, draft, pendingApproval, approved, partiallyReceived, received, cancelled,] = await Promise.all([
        prisma_1.default.purchaseOrder.count({ where: { isDeleted: false } }),
        prisma_1.default.purchaseOrder.count({ where: { status: "DRAFT", isDeleted: false } }),
        prisma_1.default.purchaseOrder.count({ where: { status: "PENDING_APPROVAL", isDeleted: false } }),
        prisma_1.default.purchaseOrder.count({ where: { status: "APPROVED", isDeleted: false } }),
        prisma_1.default.purchaseOrder.count({ where: { status: "PARTIALLY_RECEIVED", isDeleted: false } }),
        prisma_1.default.purchaseOrder.count({ where: { status: "RECEIVED", isDeleted: false } }),
        prisma_1.default.purchaseOrder.count({ where: { status: "CANCELLED", isDeleted: false } }),
    ]);
    return {
        totalOrders,
        draft,
        pendingApproval,
        approved,
        partiallyReceived,
        received,
        cancelled,
    };
}
