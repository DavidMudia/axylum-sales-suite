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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.log = log;
exports.logPurchaseOrder = logPurchaseOrder;
exports.logGoodsReceipt = logGoodsReceipt;
exports.logInventory = logInventory;
exports.logPayment = logPayment;
exports.logRefund = logRefund;
exports.logWaybill = logWaybill;
exports.getOne = getOne;
exports.getAll = getAll;
exports.stats = stats;
const client_1 = require("@prisma/client");
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./audit-log.repository"));
/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/
async function create(data) {
    const createData = {
        action: data.action,
        module: data.module,
        recordId: data.recordId,
        recordNumber: data.recordNumber,
        oldValues: data.oldValues,
        newValues: data.newValues,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
    };
    if (data.userId) {
        createData.user = {
            connect: {
                id: data.userId,
            },
        };
    }
    return repository.create(createData);
}
/*
|--------------------------------------------------------------------------
| Generic Logger
|--------------------------------------------------------------------------
|
| Safe logger that never throws.
|--------------------------------------------------------------------------
*/
async function log({ userId, action, module, recordId, recordNumber, oldValues, newValues, details, ipAddress, userAgent, endpoint, method, statusCode, }) {
    try {
        return await create({
            userId,
            action,
            module,
            recordId,
            recordNumber,
            oldValues,
            newValues,
            details,
            ipAddress,
            userAgent,
            endpoint,
            method,
            statusCode,
        });
    }
    catch (error) {
        console.error("Audit log failed:", error);
        return null;
    }
}
function logPurchaseOrder(action, purchaseOrder, userId, details) {
    return log({
        userId,
        action,
        module: client_1.AuditModule.PURCHASE_ORDER,
        recordId: purchaseOrder.id.toString(),
        recordNumber: purchaseOrder.purchaseOrderNumber,
        details,
    });
}
/*
|--------------------------------------------------------------------------
| Goods Receipt Logger
|--------------------------------------------------------------------------
*/
function logGoodsReceipt(action, receipt, userId, details) {
    return log({
        userId,
        action,
        module: client_1.AuditModule.GOODS_RECEIPT,
        recordId: receipt.id.toString(),
        recordNumber: receipt.receiptNumber,
        details,
    });
}
/*
|--------------------------------------------------------------------------
| Inventory Logger
|--------------------------------------------------------------------------
*/
function logInventory(action, inventoryId, userId, details) {
    return log({
        userId,
        action,
        module: client_1.AuditModule.INVENTORY_COUNT,
        recordId: inventoryId.toString(),
        details,
    });
}
/*
|--------------------------------------------------------------------------
| Payment Logger
|--------------------------------------------------------------------------
*/
function logPayment(action, payment, userId, details) {
    return log({
        userId,
        action,
        module: client_1.AuditModule.PAYMENT,
        recordId: payment.id.toString(),
        recordNumber: payment.paymentNumber,
        details,
    });
}
/*
|--------------------------------------------------------------------------
| Refund Logger
|--------------------------------------------------------------------------
*/
function logRefund(action, refund, userId, details) {
    return log({
        userId,
        action,
        module: client_1.AuditModule.REFUND,
        recordId: refund.id.toString(),
        recordNumber: refund.refundNumber,
        details,
    });
}
/*
|--------------------------------------------------------------------------
| Waybill Logger
|--------------------------------------------------------------------------
*/
function logWaybill(action, waybill, userId, details) {
    return log({
        userId,
        action,
        module: client_1.AuditModule.WAYBILL,
        recordId: waybill.id.toString(),
        recordNumber: waybill.waybillNumber,
        details,
    });
}
/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const auditLog = await repository.findById(id);
    if (!auditLog) {
        throw new AppError_1.AppError("Audit log not found.", 404);
    }
    return auditLog;
}
/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/
async function getAll(search, module, userId, page = 1, limit = 20) {
    const logs = await repository.findAll(search, module, userId, page, limit);
    const total = await repository.count(search, module, userId);
    return {
        data: logs,
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
| Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
