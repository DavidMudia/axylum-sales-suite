"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.findByName = findByName;
exports.update = update;
exports.softDelete = softDelete;
exports.restore = restore;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.supplier.create({
        data,
        include: {
            createdBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find All Suppliers
|--------------------------------------------------------------------------
*/
function findAll(search, page = 1, limit = 20) {
    return prisma_1.default.supplier.findMany({
        where: {
            isDeleted: false,
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        companyName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
        include: {
            createdBy: true,
            _count: {
                select: {
                    purchaseOrders: true,
                    goodsReceipts: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
}
/*
|--------------------------------------------------------------------------
| Count Suppliers
|--------------------------------------------------------------------------
*/
function count(search) {
    return prisma_1.default.supplier.count({
        where: {
            isDeleted: false,
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        companyName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: search,
                        },
                    },
                ],
            }),
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find Supplier By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.supplier.findUnique({
        where: {
            id,
        },
        include: {
            createdBy: true,
            purchaseOrders: {
                where: {
                    isDeleted: false,
                },
            },
            goodsReceipts: {
                where: {
                    isDeleted: false,
                },
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/
function findByName(name) {
    return prisma_1.default.supplier.findFirst({
        where: {
            name,
            isDeleted: false,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.supplier.update({
        where: {
            id,
        },
        data,
        include: {
            createdBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/
function softDelete(id) {
    return prisma_1.default.supplier.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Restore Supplier
|--------------------------------------------------------------------------
*/
function restore(id) {
    return prisma_1.default.supplier.update({
        where: {
            id,
        },
        data: {
            isDeleted: false,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Supplier Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [total, active, inactive, suppliers,] = await Promise.all([
        prisma_1.default.supplier.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.supplier.count({
            where: {
                status: "ACTIVE",
                isDeleted: false,
            },
        }),
        prisma_1.default.supplier.count({
            where: {
                status: "INACTIVE",
                isDeleted: false,
            },
        }),
        prisma_1.default.supplier.findMany({
            where: {
                isDeleted: false,
            },
            include: {
                _count: {
                    select: {
                        purchaseOrders: true,
                        goodsReceipts: true,
                    },
                },
            },
        }),
    ]);
    const totalPurchaseOrders = suppliers.reduce((sum, supplier) => sum + supplier._count.purchaseOrders, 0);
    const totalReceipts = suppliers.reduce((sum, supplier) => sum + supplier._count.goodsReceipts, 0);
    return {
        totalSuppliers: total,
        activeSuppliers: active,
        inactiveSuppliers: inactive,
        totalPurchaseOrders,
        totalGoodsReceipts: totalReceipts,
    };
}
