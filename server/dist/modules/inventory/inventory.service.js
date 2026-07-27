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
exports.getAll = getAll;
exports.getOne = getOne;
exports.adjust = adjust;
exports.lowStock = lowStock;
exports.outOfStock = outOfStock;
exports.history = history;
exports.stats = stats;
exports.reserveStock = reserveStock;
exports.releaseStock = releaseStock;
exports.transfer = transfer;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./inventory.repository"));
/*
|--------------------------------------------------------------------------
| Get All Inventory
|--------------------------------------------------------------------------
*/
async function getAll(search, page = 1, limit = 20) {
    const inventory = await repository.findAll(search, page, limit);
    const total = await repository.count(search);
    return {
        data: inventory,
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
| Get One Inventory
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const inventory = await repository.findById(id);
    if (!inventory) {
        throw new AppError_1.AppError("Inventory record not found.", 404);
    }
    return inventory;
}
/*
|--------------------------------------------------------------------------
| Adjust Inventory
|--------------------------------------------------------------------------
*/
async function adjust(id, data, userId) {
    const inventory = await getOne(id);
    const currentQuantity = Number(inventory.quantity);
    const adjustment = Number(data.quantity);
    const newQuantity = currentQuantity + adjustment;
    if (newQuantity < 0) {
        throw new AppError_1.AppError("Insufficient stock.", 400);
    }
    return prisma_1.default.$transaction(async (tx) => {
        const updatedInventory = await tx.inventory.update({
            where: {
                id,
            },
            data: {
                quantity: newQuantity,
            },
            include: {
                product: true,
            },
        });
        await tx.product.update({
            where: {
                id: inventory.productId,
            },
            data: {
                currentStock: newQuantity,
            },
        });
        await tx.inventoryMovement.create({
            data: {
                inventory: {
                    connect: {
                        id: inventory.id,
                    },
                },
                quantity: adjustment,
                quantityBefore: currentQuantity,
                quantityAfter: newQuantity,
                movementType: client_1.MovementType.ADJUSTMENT,
                referenceType: client_1.InventoryReferenceType.STOCK_COUNT,
                referenceId: inventory.id,
                remarks: data.reason,
                createdBy: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return updatedInventory;
    });
}
/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/
async function lowStock() {
    const inventory = await repository.getAllInventory();
    return inventory.filter((item) => Number(item.quantity) <=
        Number(item.product.minimumStock));
}
/*
|--------------------------------------------------------------------------
| Out Of Stock
|--------------------------------------------------------------------------
*/
async function outOfStock() {
    return repository.getOutOfStock();
}
/*
|--------------------------------------------------------------------------
| Movement History
|--------------------------------------------------------------------------
*/
async function history(productId) {
    return repository.getHistory(productId);
}
/*
|--------------------------------------------------------------------------
| Inventory Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
/*
|--------------------------------------------------------------------------
| Reserve Stock
|--------------------------------------------------------------------------
*/
async function reserveStock(id, quantity, userId, referenceType, referenceId) {
    const inventory = await getOne(id);
    if (quantity <= 0) {
        throw new AppError_1.AppError("Quantity must be greater than zero.", 400);
    }
    const available = Number(inventory.quantity);
    if (available < quantity) {
        throw new AppError_1.AppError("Insufficient stock available.", 400);
    }
    const before = Number(inventory.quantity);
    const after = before - quantity;
    return prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
            where: { id },
            data: {
                quantity: after,
            },
            include: {
                product: true,
            },
        });
        await tx.product.update({
            where: {
                id: inventory.productId,
            },
            data: {
                currentStock: after,
                reservedStock: {
                    increment: quantity,
                },
            },
        });
        await tx.inventoryMovement.create({
            data: {
                inventoryId: inventory.id,
                quantity,
                quantityBefore: before,
                quantityAfter: after,
                movementType: client_1.MovementType.RESERVED,
                referenceType,
                referenceId,
                createdById: userId,
            },
        });
        return updated;
    });
}
/*
|--------------------------------------------------------------------------
| Release Reserved Stock
|--------------------------------------------------------------------------
*/
async function releaseStock(id, quantity, userId, referenceType, referenceId) {
    const inventory = await getOne(id);
    const product = await prisma_1.default.product.findUnique({
        where: {
            id: inventory.productId,
        },
    });
    if (!product) {
        throw new AppError_1.AppError("Product not found.", 404);
    }
    if (Number(product.reservedStock) <
        quantity) {
        throw new AppError_1.AppError("Reserved quantity is too low.", 400);
    }
    const before = Number(inventory.quantity);
    const after = before + quantity;
    return prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
            where: { id },
            data: {
                quantity: after,
            },
            include: {
                product: true,
            },
        });
        await tx.product.update({
            where: {
                id: product.id,
            },
            data: {
                currentStock: after,
                reservedStock: {
                    decrement: quantity,
                },
            },
        });
        await tx.inventoryMovement.create({
            data: {
                inventoryId: inventory.id,
                quantity,
                quantityBefore: before,
                quantityAfter: after,
                movementType: client_1.MovementType.RELEASED,
                referenceType,
                referenceId,
                createdById: userId,
            },
        });
        return updated;
    });
}
/*
|--------------------------------------------------------------------------
| Transfer Inventory
|--------------------------------------------------------------------------
*/
async function transfer(_data, _userId) {
    throw new AppError_1.AppError("Inventory transfers are not available until warehouse locations are implemented.", 501);
}
