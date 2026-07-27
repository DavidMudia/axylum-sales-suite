// server/src/modules/waybills/waybill.service.ts
import prisma from "../../lib/prisma";
import crypto from "crypto";
import { WaybillStatus, InventoryReferenceType } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import * as repository from "./waybill.repository";
import { CreateWaybillInput } from "./waybill.schema";
import { generateDocumentNumber } from "../document-number/document-number.service";
import { DocumentType } from "@prisma/client";
import { reserveStock } from "../inventory/inventory.service";
import { logWaybill } from "../audit-log/audit-log.service";

/*
|--------------------------------------------------------------------------
| Create Waybill
|--------------------------------------------------------------------------
*/

export async function create(data: CreateWaybillInput, userId: number) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: { items: true },
  });

  if (!invoice) {
    throw new AppError("Invoice not found.", 404);
  }

  const number = await generateDocumentNumber(DocumentType.WAYBILL);

  return prisma.$transaction(async (tx) => {
    const items = [];
    const inventories: { inventoryId: number; quantity: number }[] = [];

    for (const item of invoice.items) {
      const inventory = await tx.inventory.findFirst({
        where: {
          warehouseId: data.warehouseId,
          productId: item.productId,
        },
      });

      if (!inventory) {
        throw new AppError("Inventory record not found.", 404);
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
      verificationCode: crypto.randomUUID(),
      signature: "",
      status: WaybillStatus.PENDING,
      invoice: { connect: { id: invoice.id } },
      vehicle: { connect: { id: data.vehicleId } },
      driver: { connect: { id: data.driverId } },
      warehouse: { connect: { id: data.warehouseId } },
      createdBy: { connect: { id: userId } },
      items: { create: items },
    });

    for (const item of inventories) {
      await reserveStock(
        item.inventoryId,
        item.quantity,
        userId,
        InventoryReferenceType.WAYBILL,
        waybill.id
      );
    }

    await logWaybill("Waybill Created", waybill, userId);

    return waybill;
  });
}

/*
|--------------------------------------------------------------------------
| Get All Waybills (with pagination)
|--------------------------------------------------------------------------
*/

export async function getAll(search?: string, status?: WaybillStatus, page = 1, limit = 20) {
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

export async function getOne(id: number) {
  const waybill = await repository.findById(id);
  if (!waybill) {
    throw new AppError("Waybill not found.", 404);
  }
  return waybill;
}

/*
|--------------------------------------------------------------------------
| Update Waybill Status
|--------------------------------------------------------------------------
*/

export async function updateStatus(id: number, status: WaybillStatus, userId: number) {
  const waybill = await getOne(id);

  // Validate status transition
  const validTransitions: Record<WaybillStatus, WaybillStatus[]> = {
    PENDING: ["LOADING", "CANCELLED"],
    LOADING: ["IN_TRANSIT", "CANCELLED"],
    IN_TRANSIT: ["DELIVERED", "RETURNED", "CANCELLED"],
    DELIVERED: [],
    RETURNED: [],
    CANCELLED: [],
  };

  if (!validTransitions[waybill.status].includes(status)) {
    throw new AppError(
      `Invalid status transition from ${waybill.status} to ${status}`,
      400
    );
  }

  const updated = await repository.update(id, { status });

  await logWaybill("Waybill Status Updated", updated, userId, {
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

export async function stats() {
  return repository.getStats();
}