"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.findByNumber = findByNumber;
exports.update = update;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.waybill.create({
        data,
        include: {
            invoice: true,
            vehicle: true,
            driver: true,
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
/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/
function findAll(search, status, page = 1, limit = 20) {
    return prisma_1.default.waybill.findMany({
        where: {
            ...(search && {
                OR: [
                    {
                        waybillNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        destination: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
            ...(status && {
                status,
            }),
        },
        include: {
            invoice: true,
            vehicle: true,
            driver: true,
            warehouse: true,
            createdBy: true,
            _count: {
                select: {
                    items: true,
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
function count(search, status) {
    return prisma_1.default.waybill.count({
        where: {
            ...(search && {
                OR: [
                    {
                        waybillNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        destination: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
            ...(status && {
                status,
            }),
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.waybill.findUnique({
        where: {
            id,
        },
        include: {
            invoice: true,
            vehicle: true,
            driver: true,
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
/*
|--------------------------------------------------------------------------
| Find By Number
|--------------------------------------------------------------------------
*/
function findByNumber(waybillNumber) {
    return prisma_1.default.waybill.findUnique({
        where: {
            waybillNumber,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.waybill.update({
        where: {
            id,
        },
        data,
        include: {
            invoice: true,
            vehicle: true,
            driver: true,
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
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [total, pending, loading, inTransit, delivered, returned, cancelled,] = await Promise.all([
        prisma_1.default.waybill.count(),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.PENDING,
            },
        }),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.LOADING,
            },
        }),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.IN_TRANSIT,
            },
        }),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.DELIVERED,
            },
        }),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.RETURNED,
            },
        }),
        prisma_1.default.waybill.count({
            where: {
                status: client_1.WaybillStatus.CANCELLED,
            },
        }),
    ]);
    return {
        totalWaybills: total,
        pending,
        loading,
        inTransit,
        delivered,
        returned,
        cancelled,
    };
}
