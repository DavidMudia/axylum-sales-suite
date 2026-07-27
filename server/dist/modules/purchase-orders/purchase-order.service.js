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
exports.approve = approve;
exports.cancel = cancel;
exports.stats = stats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./purchase-order.repository"));
const client_1 = require("@prisma/client");
const document_number_service_1 = require("../document-number/document-number.service");
async function create(data, userId) {
    const supplier = await prisma_1.default.supplier.findFirst({
        where: { id: data.supplierId, isDeleted: false },
    });
    if (!supplier)
        throw new AppError_1.AppError("Supplier not found.", 404);
    const warehouse = await prisma_1.default.warehouse.findUnique({
        where: { id: data.warehouseId },
    });
    if (!warehouse)
        throw new AppError_1.AppError("Warehouse not found.", 404);
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    const items = [];
    for (const item of data.items) {
        const product = await prisma_1.default.product.findFirst({
            where: { id: item.productId, isDeleted: false },
        });
        if (!product) {
            throw new AppError_1.AppError(`Product ${item.productId} not found.`, 404);
        }
        const lineSubtotal = item.unitCost * item.quantity;
        const lineDiscount = item.discount ?? 0;
        const taxableAmount = lineSubtotal - lineDiscount;
        const lineTax = item.tax ?? 0;
        const lineTotal = taxableAmount + lineTax;
        subtotal += lineSubtotal;
        totalDiscount += lineDiscount;
        totalTax += lineTax;
        items.push({
            quantity: item.quantity,
            unitCost: item.unitCost,
            discount: lineDiscount,
            tax: lineTax,
            total: lineTotal,
            remarks: item.remarks,
            product: { connect: { id: product.id } },
        });
    }
    const total = subtotal - totalDiscount + totalTax;
    const purchaseOrderNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.PURCHASE_ORDER);
    // ✅ Convert string date to Date object
    const expectedDeliveryDate = data.expectedDeliveryDate
        ? new Date(data.expectedDeliveryDate)
        : undefined;
    return repository.create({
        purchaseOrderNumber,
        subtotal,
        discount: totalDiscount,
        tax: totalTax,
        total,
        notes: data.notes,
        supplierReference: data.supplierReference,
        expectedDeliveryDate, // ← now it's a Date or undefined
        deliveryAddress: data.deliveryAddress,
        warehouse: { connect: { id: data.warehouseId } },
        supplier: { connect: { id: supplier.id } },
        createdBy: { connect: { id: userId } },
        items: { create: items },
    });
}
async function getAll(search, status, supplierId, page = 1, limit = 20) {
    const purchaseOrders = await repository.findAll(search, status, supplierId, page, limit);
    const total = await repository.count(search, status, supplierId);
    return {
        data: purchaseOrders,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
async function getOne(id) {
    const purchaseOrder = await repository.findById(id);
    if (!purchaseOrder) {
        throw new AppError_1.AppError("Purchase Order not found.", 404);
    }
    return purchaseOrder;
}
async function update(id, data) {
    await getOne(id);
    const updateData = {};
    if (data.notes !== undefined)
        updateData.notes = data.notes;
    if (data.deliveryAddress !== undefined)
        updateData.deliveryAddress = data.deliveryAddress;
    if (data.supplierReference !== undefined)
        updateData.supplierReference = data.supplierReference;
    // ✅ Convert date string to Date object if provided
    if (data.expectedDeliveryDate !== undefined) {
        updateData.expectedDeliveryDate = data.expectedDeliveryDate
            ? new Date(data.expectedDeliveryDate)
            : null; // if empty string, set to null
    }
    return repository.update(id, updateData);
}
async function remove(id) {
    await getOne(id);
    return repository.softDelete(id);
}
async function restore(id) {
    return repository.restore(id);
}
async function approve(id, userId) {
    const po = await getOne(id);
    if (po.status !== "DRAFT" &&
        po.status !== "PENDING_APPROVAL") {
        throw new AppError_1.AppError("Only pending purchase orders can be approved.", 400);
    }
    return repository.approve(id, userId);
}
async function cancel(id, userId, reason) {
    await getOne(id);
    return repository.cancel(id, userId, reason);
}
async function stats() {
    return repository.getStats();
}
