"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.getAll = getAll;
exports.getOne = getOne;
exports.update = update;
exports.remove = remove;
exports.restore = restore;
exports.stats = stats;
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./supplier.repository"));
/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/
async function create(data) {
    const existing = await repository.findByName(data.name);
    if (existing) {
        throw new AppError_1.AppError("Supplier already exists.", 400);
    }
    return repository.create(data);
}
/*
|--------------------------------------------------------------------------
| Get All Suppliers
|--------------------------------------------------------------------------
*/
async function getAll(search, page = 1, limit = 20) {
    const suppliers = await repository.findAll(search, page, limit);
    const total = await repository.count(search);
    return {
        data: suppliers,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
/*
|--------------------------------------------------------------------------
| Get Supplier
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const supplier = await repository.findById(id);
    if (!supplier) {
        throw new AppError_1.AppError("Supplier not found.", 404);
    }
    return supplier;
}
/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    await getOne(id);
    if (data.name) {
        const existing = await repository.findByName(data.name);
        if (existing &&
            existing.id !== id) {
            throw new AppError_1.AppError("Supplier with this name already exists.", 400);
        }
    }
    return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Delete Supplier
|--------------------------------------------------------------------------
*/
async function remove(id) {
    const supplier = await getOne(id);
    if (supplier.purchaseOrders.length >
        0) {
        throw new AppError_1.AppError("Supplier has purchase orders and cannot be deleted.", 400);
    }
    if (supplier.goodsReceipts.length >
        0) {
        throw new AppError_1.AppError("Supplier has goods receipts and cannot be deleted.", 400);
    }
    return repository.softDelete(id);
}
/*
|--------------------------------------------------------------------------
| Restore Supplier
|--------------------------------------------------------------------------
*/
async function restore(id) {
    await getOne(id);
    return repository.restore(id);
}
/*
|--------------------------------------------------------------------------
| Supplier Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
// server/src/modules/suppliers/supplier.service.ts
// import prisma from "../../lib/prisma";
// ... existing functions
async function getStats(id) {
    // First, get the supplier to ensure it exists
    const supplier = await prisma_1.default.supplier.findUnique({
        where: { id, isDeleted: false },
        include: {
            purchaseOrders: {
                where: { isDeleted: false },
                select: { id: true },
            },
            goodsReceipts: {
                where: { isDeleted: false },
                include: {
                    items: {
                        select: { acceptedQuantity: true },
                    },
                },
            },
        },
    });
    if (!supplier) {
        throw new AppError_1.AppError("Supplier not found", 404);
    }
    const totalPurchaseOrders = supplier.purchaseOrders.length;
    const totalGoodsReceipts = supplier.goodsReceipts.length;
    // Sum all accepted quantities from all receipts
    let totalItemsReceived = 0;
    supplier.goodsReceipts.forEach((receipt) => {
        receipt.items.forEach((item) => {
            totalItemsReceived += item.acceptedQuantity;
        });
    });
    // Monthly breakdown for the last 12 months
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago
    const monthlyData = await prisma_1.default.$queryRaw `
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM') as month,
      COUNT(*)::int as count
    FROM "GoodsReceipt"
    WHERE "supplierId" = ${id}
      AND "createdAt" >= ${startDate}
      AND "isDeleted" = false
    GROUP BY month
    ORDER BY month DESC
  `;
    // Convert bigint to number
    const monthlyReceipts = monthlyData.map((row) => ({
        month: row.month,
        count: Number(row.count),
    }));
    return {
        totalPurchaseOrders,
        totalGoodsReceipts,
        totalItemsReceived,
        monthlyReceipts,
    };
}
