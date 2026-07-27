"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.getAll = getAll;
exports.update = update;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
function create(db, data) {
    return db.refund.create({
        data,
        include: {
            payment: true,
            invoice: true,
            customer: true,
            processedBy: true,
            approvedBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.refund.findUnique({
        where: { id },
        include: {
            payment: true,
            invoice: true,
            customer: true,
            processedBy: true,
            approvedBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/
function getAll(search, status, customerId, page = 1, limit = 20) {
    return prisma_1.default.refund.findMany({
        where: {
            ...(status && { status }),
            ...(customerId && { customerId }),
            ...(search && {
                OR: [
                    {
                        refundNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        reason: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
        include: {
            payment: true,
            invoice: true,
            customer: true,
            processedBy: true,
            approvedBy: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
function update(db, id, data) {
    return db.refund.update({
        where: { id },
        data,
        include: {
            payment: true,
            invoice: true,
            customer: true,
            processedBy: true,
            approvedBy: true,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [totalRefunds, pending, approved, totalAmount,] = await Promise.all([
        prisma_1.default.refund.count(),
        prisma_1.default.refund.count({
            where: {
                status: "PENDING",
            },
        }),
        prisma_1.default.refund.count({
            where: {
                status: "APPROVED",
            },
        }),
        prisma_1.default.refund.aggregate({
            _sum: {
                amount: true,
            },
        }),
    ]);
    return {
        totalRefunds,
        pending,
        approved,
        totalAmount: totalAmount._sum.amount ?? 0,
    };
}
