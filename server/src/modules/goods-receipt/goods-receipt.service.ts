import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

import * as repository from "./goods-receipt.repository";

import {
  CreateGoodsReceiptInput,
} from "./goods-receipts.schema";

import {
  DocumentType,
  GoodsReceiptStatus,
  PurchaseOrderStatus,
  MovementType,
  InventoryReferenceType,
} from "@prisma/client";

import {
  generateDocumentNumber,
} from "../document-number/document-number.service";
import {
  UpdateGoodsReceiptInput,
} from "./goods-receipts.schema";


export async function getAll(
  search?: string,
  status?: GoodsReceiptStatus,
  warehouseId?: number,
  supplierId?: number,
  page = 1,
  limit = 20
) {
  return repository.getAll(
    search,
    status,
    warehouseId,
    supplierId,
    page,
    limit
  );
}

export async function getOne(id: number) {
  const receipt = await repository.findById(id);
  if (!receipt) {
    throw new AppError("Goods receipt not found.", 404);
  }
  return receipt;
}

export async function update(
  id: number,
  data: UpdateGoodsReceiptInput
) {
  const receipt = await getOne(id);
  if (receipt.status === GoodsReceiptStatus.VERIFIED) {
    throw new AppError("Verified goods receipt cannot be edited.", 400);
  }
  return repository.update(id, {
    supplierInvoiceNumber: data.supplierInvoiceNumber,
    supplierDeliveryNote: data.supplierDeliveryNote,
    truckNumber: data.truckNumber,
    driverName: data.driverName,
    remarks: data.remarks,
  });
}

export async function verify(id: number, userId: number) {
  const receipt = await getOne(id);
  if (receipt.status === GoodsReceiptStatus.VERIFIED) {
    throw new AppError("Goods receipt has already been verified.", 400);
  }
  return repository.verify(id, userId);
}

export async function remove(id: number) {
  await getOne(id);
  return repository.softDelete(id);
}

export async function restore(id: number) {
  const receipt = await prisma.goodsReceipt.findFirst({
    where: { id, isDeleted: true },
  });
  if (!receipt) {
    throw new AppError("Goods receipt not found.", 404);
  }
  return repository.restore(id);
}

export async function stats() {
  return repository.getStats();
}

export async function dashboard() {
  return repository.dashboard();
}
export async function create(data: CreateGoodsReceiptInput, userId: number) {
  return prisma.$transaction(async (tx) => {
    // ------------------------------------------------------------------------
    // Purchase Order
    // ------------------------------------------------------------------------
    const purchaseOrder = await tx.purchaseOrder.findFirst({
      where: { id: data.purchaseOrderId, isDeleted: false },
      include: { items: true, supplier: true },
    });
    if (!purchaseOrder) throw new AppError("Purchase order not found.", 404);
    if (
      purchaseOrder.status !== PurchaseOrderStatus.APPROVED &&
      purchaseOrder.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED
    ) {
      throw new AppError("This purchase order cannot receive goods.", 400);
    }

    // ------------------------------------------------------------------------
    // Warehouse
    // ------------------------------------------------------------------------
    const warehouse = await tx.warehouse.findUnique({
      where: { id: data.warehouseId },
    });
    if (!warehouse) throw new AppError("Warehouse not found.", 404);

    // ------------------------------------------------------------------------
    // GRN Number
    // ------------------------------------------------------------------------
    const receiptNumber = await generateDocumentNumber(DocumentType.GOODS_RECEIPT);

    let totalAccepted = 0;
    let totalRejected = 0;
    const receiptItems = [];

    // ------------------------------------------------------------------------
    // Receive Items
    // ------------------------------------------------------------------------
    for (const incoming of data.items) {
      const poItem = purchaseOrder.items.find(
        (item) => item.id === incoming.purchaseOrderItemId
      );
      if (!poItem) throw new AppError("Purchase order item not found.", 404);

      const remaining = poItem.quantity - poItem.receivedQuantity;
      if (incoming.receivedQuantity > remaining) {
        throw new AppError(
          `Cannot receive more than ordered for product ${poItem.productId}.`,
          400
        );
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
      } else {
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
          movementType: MovementType.PURCHASE,
          referenceType: InventoryReferenceType.GOODS_RECEIPT,
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
      status: GoodsReceiptStatus.RECEIVED,
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
    const completed = refreshed!.items.every(
      (item) => item.receivedQuantity >= item.quantity
    );
    await tx.purchaseOrder.update({
      where: { id: purchaseOrder.id },
      data: {
        status: completed
          ? PurchaseOrderStatus.RECEIVED
          : PurchaseOrderStatus.PARTIALLY_RECEIVED,
      },
    });

    return receipt;
  });
}
