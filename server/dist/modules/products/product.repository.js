"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.findByProductNumber = findByProductNumber;
exports.findByName = findByName;
exports.update = update;
exports.softDelete = softDelete;
exports.restore = restore;
exports.getLowStockProducts = getLowStockProducts;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.product.create({
        data,
        include: {
            createdBy: true,
            updatedBy: true,
            inventories: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/
function findAll(search, page = 1, limit = 20) {
    return prisma_1.default.product.findMany({
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
                        productNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
        include: {
            inventories: true,
            createdBy: true,
            updatedBy: true,
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
| Count
|--------------------------------------------------------------------------
*/
function count(search) {
    return prisma_1.default.product.count({
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
                        productNumber: {
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
| Find By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.product.findUnique({
        where: {
            id,
        },
        include: {
            inventories: true,
            createdBy: true,
            updatedBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Number
|--------------------------------------------------------------------------
*/
function findByProductNumber(productNumber) {
    return prisma_1.default.product.findUnique({
        where: {
            productNumber,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/
function findByName(name) {
    return prisma_1.default.product.findFirst({
        where: {
            name,
            isDeleted: false,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.product.update({
        where: {
            id,
        },
        data,
        include: {
            inventories: true,
            createdBy: true,
            updatedBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/
function softDelete(id) {
    return prisma_1.default.product.update({
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
| Restore
|--------------------------------------------------------------------------
*/
function restore(id) {
    return prisma_1.default.product.update({
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
| Low Stock
|--------------------------------------------------------------------------
*/
async function getLowStockProducts() {
    const products = await prisma_1.default.product.findMany({
        where: {
            isDeleted: false
        },
        include: {
            createdBy: true,
            updatedBy: true,
            inventories: true,
        }
    });
    return products.filter(product => Number(product.currentStock) <=
        Number(product.minimumStock));
}
