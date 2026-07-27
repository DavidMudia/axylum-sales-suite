"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.findByProduct = findByProduct;
exports.update = update;
exports.getAllInventory = getAllInventory;
exports.getOutOfStock = getOutOfStock;
exports.getHistory = getHistory;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Find All Inventory
|--------------------------------------------------------------------------
*/
function findAll(search, page = 1, limit = 20) {
    return prisma_1.default.inventory.findMany({
        where: {
            ...(search && {
                product: {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            productNumber: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            sku: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            }),
        },
        include: {
            product: {
                include: {},
            },
        },
        orderBy: {
            product: {
                name: "asc",
            },
        },
        skip: (page - 1) * limit,
        take: limit,
    });
}
/*
|--------------------------------------------------------------------------
| Count Inventory
|--------------------------------------------------------------------------
*/
function count(search) {
    return prisma_1.default.inventory.count({
        where: {
            ...(search && {
                product: {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            productNumber: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            }),
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find Inventory By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.inventory.findUnique({
        where: {
            id,
        },
        include: {
            product: {
                include: {},
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Product ID
|--------------------------------------------------------------------------
*/
function findByProduct(productId) {
    return prisma_1.default.inventory.findFirst({
        where: {
            productId,
        },
        include: {
            product: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update Inventory
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.inventory.update({
        where: {
            id,
        },
        data,
        include: {
            product: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Get All Inventory (For Low Stock Check)
|--------------------------------------------------------------------------
*/
function getAllInventory() {
    return prisma_1.default.inventory.findMany({
        include: {
            product: {
                include: {},
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Out Of Stock
|--------------------------------------------------------------------------
*/
function getOutOfStock() {
    return prisma_1.default.inventory.findMany({
        where: {
            quantity: {
                lte: 0,
            },
        },
        include: {
            product: {
                include: {},
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Inventory Movement History
|--------------------------------------------------------------------------
*/
function getHistory(productId) {
    return prisma_1.default.inventoryMovement.findMany({
        where: {
            inventory: {
                productId,
            },
        },
        include: {
            inventory: {
                include: {
                    product: true,
                },
            },
            createdBy: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Inventory Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [totalProducts, activeProducts, inactiveProducts, inventoryItems, inventory,] = await Promise.all([
        prisma_1.default.product.count(),
        prisma_1.default.product.count({
            where: {
                isActive: true,
                isDeleted: false,
            },
        }),
        prisma_1.default.product.count({
            where: {
                OR: [
                    { isActive: false },
                    { isDeleted: true },
                ],
            },
        }),
        prisma_1.default.inventory.count(),
        prisma_1.default.inventory.findMany({
            include: {
                product: true,
            },
        }),
    ]);
    const totalStock = inventory.reduce((sum, item) => sum + Number(item.quantity), 0);
    const inventoryValue = inventory.reduce((sum, item) => sum +
        Number(item.quantity) *
            Number(item.product.costPrice), 0);
    const lowStock = inventory.filter((item) => Number(item.quantity) <=
        Number(item.product.minimumStock)).length;
    const outOfStock = inventory.filter((item) => Number(item.quantity) <= 0).length;
    return {
        totalProducts,
        activeProducts,
        inactiveProducts,
        inventoryItems,
        totalStock,
        inventoryValue,
        lowStock,
        outOfStock,
    };
}
