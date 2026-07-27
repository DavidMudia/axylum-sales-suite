"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.findByCustomerNumber = findByCustomerNumber;
exports.findByName = findByName;
exports.update = update;
exports.softDelete = softDelete;
exports.restore = restore;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.customer.create({
        data,
        include: {
            createdBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find All Customers
|--------------------------------------------------------------------------
*/
function findAll(search, page = 1, limit = 20) {
    return prisma_1.default.customer.findMany({
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
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customerNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
        include: {
            createdBy: true,
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
| Count Customers
|--------------------------------------------------------------------------
*/
function count(search) {
    return prisma_1.default.customer.count({
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
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customerNumber: {
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
| Find Customer By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.customer.findUnique({
        where: {
            id,
        },
        include: {
            createdBy: true,
            quotes: true,
            salesOrders: true,
            invoices: true,
            payments: true,
            refunds: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find Customer By Number
|--------------------------------------------------------------------------
*/
function findByCustomerNumber(customerNumber) {
    return prisma_1.default.customer.findUnique({
        where: {
            customerNumber,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find Customer By Name
|--------------------------------------------------------------------------
*/
function findByName(name) {
    return prisma_1.default.customer.findFirst({
        where: {
            name,
            isDeleted: false,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.customer.update({
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
    return prisma_1.default.customer.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            status: "INACTIVE",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Restore Customer
|--------------------------------------------------------------------------
*/
function restore(id) {
    return prisma_1.default.customer.update({
        where: {
            id,
        },
        data: {
            isDeleted: false,
            status: "ACTIVE",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Customer Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [totalCustomers, activeCustomers, inactiveCustomers, blockedCustomers, totalOutstanding,] = await Promise.all([
        prisma_1.default.customer.count({
            where: {
                isDeleted: false,
            },
        }),
        prisma_1.default.customer.count({
            where: {
                status: "ACTIVE",
                isDeleted: false,
            },
        }),
        prisma_1.default.customer.count({
            where: {
                status: "INACTIVE",
                isDeleted: false,
            },
        }),
        prisma_1.default.customer.count({
            where: {
                status: "BLOCKED",
                isDeleted: false,
            },
        }),
        prisma_1.default.customer.aggregate({
            _sum: {
                outstandingBalance: true,
            },
            where: {
                isDeleted: false,
            },
        }),
    ]);
    return {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        blockedCustomers,
        totalOutstanding: Number(totalOutstanding._sum
            .outstandingBalance ?? 0),
    };
}
