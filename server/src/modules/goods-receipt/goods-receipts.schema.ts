import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Goods Receipt Item
|--------------------------------------------------------------------------
*/

export const goodsReceiptItemSchema = z.object({
  purchaseOrderItemId: z
    .number()
    .int()
    .positive(),

  receivedQuantity:
  z.number().positive(
    "Received quantity must be greater than zero"
  ),

  rejectedQuantity:
  z.number().min(
    0,
    "Rejected quantity cannot be negative"
  ),

  remarks: z
    .string()
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Create Goods Receipt
|--------------------------------------------------------------------------
*/

export const createGoodsReceiptSchema = z.object({
  purchaseOrderId: z
    .number()
    .int()
    .positive(),

  warehouseId: z
    .number()
    .int()
    .positive(),

  supplierInvoiceNumber: z
    .string()
    .optional(),

  supplierDeliveryNote: z
    .string()
    .optional(),

  truckNumber: z
    .string()
    .optional(),

  driverName: z
    .string()
    .optional(),

  remarks: z
    .string()
    .optional(),

  items: z
    .array(goodsReceiptItemSchema)
    .min(1),
});

/*
|--------------------------------------------------------------------------
| Update Goods Receipt
|--------------------------------------------------------------------------
*/

export const updateGoodsReceiptSchema =
  z.object({
    supplierInvoiceNumber: z
      .string()
      .optional(),

    supplierDeliveryNote: z
      .string()
      .optional(),

    truckNumber: z
      .string()
      .optional(),

    driverName: z
      .string()
      .optional(),

    remarks: z
      .string()
      .optional(),
  });

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type CreateGoodsReceiptInput =
  z.infer<
    typeof createGoodsReceiptSchema
  >;

export type UpdateGoodsReceiptInput =
  z.infer<
    typeof updateGoodsReceiptSchema
  >;