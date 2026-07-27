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
exports.update = update;
exports.verify = verify;
exports.remove = remove;
exports.restore = restore;
exports.stats = stats;
exports.dashboard = dashboard;
exports.create = create;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./goods-receipt.repository"));
const client_1 = require("@prisma/client");
const document_number_service_1 = require("../document-number/document-number.service");
async function getAll(search, status, warehouseId, supplierId, page = 1, limit = 20) {
    return repository.getAll(search, status, warehouseId, supplierId, page, limit);
}
async function getOne(id) {
    const receipt = await repository.findById(id);
    if (!receipt) {
        throw new AppError_1.AppError("Goods receipt not found.", 404);
    }
    return receipt;
}
async function update(id, data) {
    const receipt = await getOne(id);
    if (receipt.status === client_1.GoodsReceiptStatus.VERIFIED) {
        throw new AppError_1.AppError("Verified goods receipt cannot be edited.", 400);
    }
    return repository.update(id, {
        supplierInvoiceNumber: data.supplierInvoiceNumber,
        supplierDeliveryNote: data.supplierDeliveryNote,
        truckNumber: data.truckNumber,
        driverName: data.driverName,
        remarks: data.remarks,
    });
}
async function verify(id, userId) {
    const receipt = await getOne(id);
    if (receipt.status === client_1.GoodsReceiptStatus.VERIFIED) {
        throw new AppError_1.AppError("Goods receipt has already been verified.", 400);
    }
    return repository.verify(id, userId);
}
async function remove(id) {
    await getOne(id);
    return repository.softDelete(id);
}
async function restore(id) {
    const receipt = await prisma_1.default.goodsReceipt.findFirst({
        where: { id, isDeleted: true },
    });
    if (!receipt) {
        throw new AppError_1.AppError("Goods receipt not found.", 404);
    }
    return repository.restore(id);
}
async function stats() {
    return repository.getStats();
}
async function dashboard() {
    return repository.dashboard();
}
async function create(data, userId) {
    return prisma_1.default.$transaction(async (tx) => {
        // ------------------------------------------------------------------------
        // Purchase Order
        // ------------------------------------------------------------------------
        const purchaseOrder = await tx.purchaseOrder.findFirst({
            where: { id: data.purchaseOrderId, isDeleted: false },
            include: { items: true, supplier: true },
        });
        if (!purchaseOrder)
            throw new AppError_1.AppError("Purchase order not found.", 404);
        if (purchaseOrder.status !== client_1.PurchaseOrderStatus.APPROVED &&
            purchaseOrder.status !== client_1.PurchaseOrderStatus.PARTIALLY_RECEIVED) {
            throw new AppError_1.AppError("This purchase order cannot receive goods.", 400);
        }
        // ------------------------------------------------------------------------
        // Warehouse
        // ------------------------------------------------------------------------
        const warehouse = await tx.warehouse.findUnique({
            where: { id: data.warehouseId },
        });
        if (!warehouse)
            throw new AppError_1.AppError("Warehouse not found.", 404);
        // ------------------------------------------------------------------------
        // GRN Number
        // ------------------------------------------------------------------------
        const receiptNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.GOODS_RECEIPT);
        let totalAccepted = 0;
        let totalRejected = 0;
        const receiptItems = [];
        // ------------------------------------------------------------------------
        // Receive Items
        // ------------------------------------------------------------------------
        for (const incoming of data.items) {
            const poItem = purchaseOrder.items.find((item) => item.id === incoming.purchaseOrderItemId);
            if (!poItem)
                throw new AppError_1.AppError("Purchase order item not found.", 404);
            const remaining = poItem.quantity - poItem.receivedQuantity;
            if (incoming.receivedQuantity > remaining) {
                throw new AppError_1.AppError(`Cannot receive more than ordered for product ${poItem.productId}.`, 400);
            }
            const rejected = incoming.rejectedQuantity ?? 0;
            const accepted = incoming.receivedQuantity - rejected;
            totalAccepted += accepted;
            totalRejected += rejected;
            // Update PurchaseOrderItem
            await tx.purchaseOrderItem.update({
                where: { id: poItem.id },
                data: { receivedQuantity: { increment: incoming.receivedQuantity } },
            });
            // Inventory
            let inventory = await tx.inventory.findFirst({
                where: { productId: poItem.productId, warehouseId: warehouse.id },
            });
            if (!inventory) {
                inventory = await tx.inventory.create({
                    data: {
                        product: { connect: { id: poItem.productId } },
                        warehouse: { connect: { id: warehouse.id } },
                        quantity: accepted,
                        availableQuantity: accepted,
                        reservedQuantity: 0,
                        reorderLevel: 10,
                    },
                });
            }
            else {
                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: {
                        quantity: { increment: accepted },
                        availableQuantity: { increment: accepted },
                    },
                });
            }
            // Inventory Movement
            await tx.inventoryMovement.create({
                data: {
                    inventoryId: inventory.id,
                    quantity: accepted,
                    quantityBefore: Number(inventory.quantity),
                    quantityAfter: Number(inventory.quantity) + accepted,
                    movementType: client_1.MovementType.PURCHASE,
                    referenceType: client_1.InventoryReferenceType.GOODS_RECEIPT,
                    referenceId: purchaseOrder.id,
                    remarks: "Goods received",
                    createdById: userId,
                },
            });
            // ✅ Update Product currentStock
            await tx.product.update({
                where: { id: poItem.productId },
                data: { currentStock: { increment: accepted } },
            });
            // ✅ Update Product costPrice to the unitCost from the PO item
            await tx.product.update({
                where: { id: poItem.productId },
                data: { costPrice: poItem.unitCost },
            });
            // Build receipt item
            receiptItems.push({
                purchaseOrderItem: { connect: { id: poItem.id } },
                product: { connect: { id: poItem.productId } },
                orderedQuantity: poItem.quantity,
                receivedQuantity: incoming.receivedQuantity,
                rejectedQuantity: rejected,
                acceptedQuantity: accepted,
                unitCost: poItem.unitCost,
                remarks: incoming.remarks,
            });
        }
        // ------------------------------------------------------------------------
        // Create Goods Receipt
        // ------------------------------------------------------------------------
        const receipt = await repository.create({
            receiptNumber,
            supplier: { connect: { id: purchaseOrder.supplierId } },
            purchaseOrder: { connect: { id: purchaseOrder.id } },
            warehouse: { connect: { id: warehouse.id } },
            status: client_1.GoodsReceiptStatus.RECEIVED,
            receivedBy: { connect: { id: userId } },
            supplierInvoiceNumber: data.supplierInvoiceNumber,
            supplierDeliveryNote: data.supplierDeliveryNote,
            truckNumber: data.truckNumber,
            driverName: data.driverName,
            remarks: data.remarks,
            totalReceivedItems: totalAccepted,
            totalRejectedItems: totalRejected,
            items: { create: receiptItems },
        });
        // ------------------------------------------------------------------------
        // Update Purchase Order Status
        // ------------------------------------------------------------------------
        const refreshed = await tx.purchaseOrder.findUnique({
            where: { id: purchaseOrder.id },
            include: { items: true },
        });
        const completed = refreshed.items.every((item) => item.receivedQuantity >= item.quantity);
        await tx.purchaseOrder.update({
            where: { id: purchaseOrder.id },
            data: {
                status: completed
                    ? client_1.PurchaseOrderStatus.RECEIVED
                    : client_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
            },
        });
        return receipt;
    });
}
