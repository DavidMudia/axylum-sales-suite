"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.getAll = getAll;
exports.update = update;
exports.verify = verify;
exports.softDelete = softDelete;
exports.restore = restore;
exports.getStats = getStats;
exports.dashboard = dashboard;
// server/src/modules/goods-receipt/goods-receipt.repository.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.goodsReceipt.create({
        data,
        include: {
            supplier: true,
            warehouse: true,
            purchaseOrder: true,
            receivedBy: {
                select: { id: true, firstName: true, lastName: true },
            },
            verifiedBy: {
                select: { id: true, firstName: true, lastName: true },
            },
            items: {
                include: {
                    product: true,
                    purchaseOrderItem: true,
                },
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find One
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.goodsReceipt.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            supplier: true,
            warehouse: true,
            purchaseOrder: true,
            receivedBy: {
                select: { id: true, firstName: true, lastName: true },
            },
            verifiedBy: {
                select: { id: true, firstName: true, lastName: true },
            },
            items: {
                include: {
                    product: true,
                    purchaseOrderItem: true,
                },
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/
function getAll(search, status, warehouseId, supplierId, page = 1, limit = 20) {
    return prisma_1.default.goodsReceipt.findMany({
        where: {
            isDeleted: false,
            ...(status && { status }),
            ...(warehouseId && { warehouseId }),
            ...(supplierId && { supplierId }),
            ...(search && {
                OR: [
                    { receiptNumber: { contains: search, mode: "insensitive" } },
                    { supplier: { name: { contains: search, mode: "insensitive" } } },
                    { purchaseOrder: { purchaseOrderNumber: { contains: search, mode: "insensitive" } } },
                ],
            }),
        },
        include: {
            supplier: true,
            warehouse: true,
            purchaseOrder: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
}
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
function update(id, data) {
    return prisma_1.default.goodsReceipt.update({
        where: { id },
        data,
        include: { items: true },
    });
}
/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/
function verify(id, verifiedById) {
    return prisma_1.default.goodsReceipt.update({
        where: { id },
        data: {
            status: client_1.GoodsReceiptStatus.VERIFIED,
            verifiedAt: new Date(),
            verifiedBy: { connect: { id: verifiedById } },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/
function softDelete(id) {
    return prisma_1.default.goodsReceipt.update({
        where: { id },
        data: { isDeleted: true },
    });
}
/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/
function restore(id) {
    return prisma_1.default.goodsReceipt.update({
        where: { id },
        data: { isDeleted: false },
    });
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function getStats() {
    const [totalReceipts, received, verified, cancelled] = await Promise.all([
        prisma_1.default.goodsReceipt.count({ where: { isDeleted: false } }),
        prisma_1.default.goodsReceipt.count({ where: { status: client_1.GoodsReceiptStatus.RECEIVED, isDeleted: false } }),
        prisma_1.default.goodsReceipt.count({ where: { status: client_1.GoodsReceiptStatus.VERIFIED, isDeleted: false } }),
        prisma_1.default.goodsReceipt.count({ where: { status: client_1.GoodsReceiptStatus.CANCELLED, isDeleted: false } }),
    ]);
    return { totalReceipts, received, verified, cancelled };
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
async function dashboard() {
    const receipts = await prisma_1.default.goodsReceipt.findMany({
        where: { isDeleted: false },
        include: {
            supplier: true,
            warehouse: true,
            purchaseOrder: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return {
        summary: {
            totalReceipts: receipts.length,
            received: receipts.filter((r) => r.status === client_1.GoodsReceiptStatus.RECEIVED).length,
            verified: receipts.filter((r) => r.status === client_1.GoodsReceiptStatus.VERIFIED).length,
            cancelled: receipts.filter((r) => r.status === client_1.GoodsReceiptStatus.CANCELLED).length,
        },
        receipts,
    };
}
