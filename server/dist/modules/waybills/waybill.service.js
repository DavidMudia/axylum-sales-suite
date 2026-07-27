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
exports.updateStatus = updateStatus;
exports.stats = stats;
// server/src/modules/waybills/waybill.service.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./waybill.repository"));
const document_number_service_1 = require("../document-number/document-number.service");
const client_2 = require("@prisma/client");
const inventory_service_1 = require("../inventory/inventory.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
/*
|--------------------------------------------------------------------------
| Create Waybill
|--------------------------------------------------------------------------
*/
async function create(data, userId) {
    const invoice = await prisma_1.default.invoice.findUnique({
        where: { id: data.invoiceId },
        include: { items: true },
    });
    if (!invoice) {
        throw new AppError_1.AppError("Invoice not found.", 404);
    }
    const number = await (0, document_number_service_1.generateDocumentNumber)(client_2.DocumentType.WAYBILL);
    return prisma_1.default.$transaction(async (tx) => {
        const items = [];
        const inventories = [];
        for (const item of invoice.items) {
            const inventory = await tx.inventory.findFirst({
                where: {
                    warehouseId: data.warehouseId,
                    productId: item.productId,
                },
            });
            if (!inventory) {
                throw new AppError_1.AppError("Inventory record not found.", 404);
            }
            inventories.push({
                inventoryId: inventory.id,
                quantity: item.quantity,
            });
            items.push({
                product: { connect: { id: item.productId } },
                quantity: item.quantity,
            });
        }
        const waybill = await repository.create({
            waybillNumber: number,
            destination: data.destination,
            verificationCode: crypto_1.default.randomUUID(),
            signature: "",
            status: client_1.WaybillStatus.PENDING,
            invoice: { connect: { id: invoice.id } },
            vehicle: { connect: { id: data.vehicleId } },
            driver: { connect: { id: data.driverId } },
            warehouse: { connect: { id: data.warehouseId } },
            createdBy: { connect: { id: userId } },
            items: { create: items },
        });
        for (const item of inventories) {
            await (0, inventory_service_1.reserveStock)(item.inventoryId, item.quantity, userId, client_1.InventoryReferenceType.WAYBILL, waybill.id);
        }
        await (0, audit_log_service_1.logWaybill)("Waybill Created", waybill, userId);
        return waybill;
    });
}
/*
|--------------------------------------------------------------------------
| Get All Waybills (with pagination)
|--------------------------------------------------------------------------
*/
async function getAll(search, status, page = 1, limit = 20) {
    const waybills = await repository.findAll(search, status, page, limit);
    const total = await repository.count(search, status);
    return {
        data: waybills,
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
| Get Single Waybill
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const waybill = await repository.findById(id);
    if (!waybill) {
        throw new AppError_1.AppError("Waybill not found.", 404);
    }
    return waybill;
}
/*
|--------------------------------------------------------------------------
| Update Waybill Status
|--------------------------------------------------------------------------
*/
async function updateStatus(id, status, userId) {
    const waybill = await getOne(id);
    // Validate status transition
    const validTransitions = {
        PENDING: ["LOADING", "CANCELLED"],
        LOADING: ["IN_TRANSIT", "CANCELLED"],
        IN_TRANSIT: ["DELIVERED", "RETURNED", "CANCELLED"],
        DELIVERED: [],
        RETURNED: [],
        CANCELLED: [],
    };
    if (!validTransitions[waybill.status].includes(status)) {
        throw new AppError_1.AppError(`Invalid status transition from ${waybill.status} to ${status}`, 400);
    }
    const updated = await repository.update(id, { status });
    await (0, audit_log_service_1.logWaybill)("Waybill Status Updated", updated, userId, {
        oldStatus: waybill.status,
        newStatus: status,
    });
    return updated;
}
/*
|--------------------------------------------------------------------------
| Waybill Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
