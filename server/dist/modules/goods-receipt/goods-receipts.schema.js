"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoodsReceiptSchema = exports.createGoodsReceiptSchema = exports.goodsReceiptItemSchema = void 0;
const zod_1 = require("zod");
/*
|--------------------------------------------------------------------------
| Goods Receipt Item
|--------------------------------------------------------------------------
*/
exports.goodsReceiptItemSchema = zod_1.z.object({
    purchaseOrderItemId: zod_1.z
        .number()
        .int()
        .positive(),
    receivedQuantity: zod_1.z.number().positive("Received quantity must be greater than zero"),
    rejectedQuantity: zod_1.z.number().min(0, "Rejected quantity cannot be negative"),
    remarks: zod_1.z
        .string()
        .optional(),
});
/*
|--------------------------------------------------------------------------
| Create Goods Receipt
|--------------------------------------------------------------------------
*/
exports.createGoodsReceiptSchema = zod_1.z.object({
    purchaseOrderId: zod_1.z
        .number()
        .int()
        .positive(),
    warehouseId: zod_1.z
        .number()
        .int()
        .positive(),
    supplierInvoiceNumber: zod_1.z
        .string()
        .optional(),
    supplierDeliveryNote: zod_1.z
        .string()
        .optional(),
    truckNumber: zod_1.z
        .string()
        .optional(),
    driverName: zod_1.z
        .string()
        .optional(),
    remarks: zod_1.z
        .string()
        .optional(),
    items: zod_1.z
        .array(exports.goodsReceiptItemSchema)
        .min(1),
});
/*
|--------------------------------------------------------------------------
| Update Goods Receipt
|--------------------------------------------------------------------------
*/
exports.updateGoodsReceiptSchema = zod_1.z.object({
    supplierInvoiceNumber: zod_1.z
        .string()
        .optional(),
    supplierDeliveryNote: zod_1.z
        .string()
        .optional(),
    truckNumber: zod_1.z
        .string()
        .optional(),
    driverName: zod_1.z
        .string()
        .optional(),
    remarks: zod_1.z
        .string()
        .optional(),
});
