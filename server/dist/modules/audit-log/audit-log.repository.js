"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.findAll = findAll;
exports.count = count;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.auditLog.create({
        data,
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.auditLog.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/
function findAll(search, module, userId, page = 1, limit = 20) {
    return prisma_1.default.auditLog.findMany({
        where: {
            ...(module && {
                module,
            }),
            ...(userId && {
                userId,
            }),
            ...(search && {
                OR: [
                    {
                        action: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        recordNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        recordId: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
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
/*
|--------------------------------------------------------------------------
| Count
|--------------------------------------------------------------------------
*/
function count(search, module, userId) {
    return prisma_1.default.auditLog.count({
        where: {
            ...(module && {
                module,
            }),
            ...(userId && {
                userId,
            }),
            ...(search && {
                OR: [
                    {
                        action: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        recordNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        recordId: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
    });
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [total, payment, refunds, waybills, purchaseOrders, goodsReceipts, inventoryCounts,] = await Promise.all([
        prisma_1.default.auditLog.count(),
        prisma_1.default.auditLog.count({
            where: {
                module: "PAYMENT",
            },
        }),
        prisma_1.default.auditLog.count({
            where: {
                module: "REFUND",
            },
        }),
        prisma_1.default.auditLog.count({
            where: {
                module: "WAYBILL",
            },
        }),
        prisma_1.default.auditLog.count({
            where: {
                module: "PURCHASE_ORDER",
            },
        }),
        prisma_1.default.auditLog.count({
            where: {
                module: "GOODS_RECEIPT",
            },
        }),
        prisma_1.default.auditLog.count({
            where: {
                module: "INVENTORY_COUNT",
            },
        }),
    ]);
    return {
        totalLogs: total,
        paymentLogs: payment,
        refundLogs: refunds,
        waybillLogs: waybills,
        purchaseOrderLogs: purchaseOrders,
        goodsReceiptLogs: goodsReceipts,
        inventoryCountLogs: inventoryCounts,
    };
}
