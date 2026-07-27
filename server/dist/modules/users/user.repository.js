"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.findByEmail = findByEmail;
exports.findByEmployeeNumber = findByEmployeeNumber;
exports.update = update;
exports.updatePassword = updatePassword;
exports.activate = activate;
exports.deactivate = deactivate;
exports.softDelete = softDelete;
exports.restore = restore;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.user.create({
        data,
        include: {
            role: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find All Users
|--------------------------------------------------------------------------
*/
function findAll(search, page = 1, limit = 20) {
    return prisma_1.default.user.findMany({
        where: {
            deletedAt: null,
            ...(search && {
                OR: [
                    {
                        firstName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastName: {
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
                        employeeNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
        include: {
            role: true,
        },
        orderBy: {
            firstName: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
}
/*
|--------------------------------------------------------------------------
| Count Users
|--------------------------------------------------------------------------
*/
function count(search) {
    return prisma_1.default.user.count({
        where: {
            deletedAt: null,
            ...(search && {
                OR: [
                    {
                        firstName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastName: {
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
                        employeeNumber: {
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
    return prisma_1.default.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            role: true,
            settings: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Email
|--------------------------------------------------------------------------
*/
function findByEmail(email) {
    return prisma_1.default.user.findUnique({
        where: {
            email,
        },
        include: {
            role: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Employee Number
|--------------------------------------------------------------------------
*/
function findByEmployeeNumber(employeeNumber) {
    return prisma_1.default.user.findUnique({
        where: {
            employeeNumber,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data,
        include: {
            role: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update Password
|--------------------------------------------------------------------------
*/
function updatePassword(id, password, mustChangePassword = false) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            password,
            mustChangePassword,
            passwordChangedAt: new Date(),
            failedLoginAttempts: 0,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/
function activate(id) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            isActive: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/
function deactivate(id) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            isActive: false,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/
function softDelete(id) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}
/*
|--------------------------------------------------------------------------
| Restore User
|--------------------------------------------------------------------------
*/
function restore(id) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}
/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [total, active, inactive, locked,] = await Promise.all([
        prisma_1.default.user.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.default.user.count({
            where: {
                isActive: true,
                deletedAt: null,
            },
        }),
        prisma_1.default.user.count({
            where: {
                isActive: false,
                deletedAt: null,
            },
        }),
        prisma_1.default.user.count({
            where: {
                failedLoginAttempts: {
                    gte: 5,
                },
                deletedAt: null,
            },
        }),
    ]);
    return {
        totalUsers: total,
        activeUsers: active,
        inactiveUsers: inactive,
        lockedUsers: locked,
    };
}
