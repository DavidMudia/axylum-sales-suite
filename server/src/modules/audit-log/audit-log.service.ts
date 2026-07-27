import { Prisma, AuditModule } from "@prisma/client";

import { AppError } from "../../utils/AppError";

import * as repository from "./audit-log.repository";

import {
  CreateAuditLogInput,
} from "./audit-log.schema";

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export async function create(
  data: CreateAuditLogInput
) {

  const createData: Prisma.AuditLogCreateInput = {

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

export async function log({

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

}: {

  userId?: number;

  action: string;

  module: AuditModule;

  recordId?: string;

  recordNumber?: string;

  oldValues?: Prisma.JsonValue;

  newValues?: Prisma.JsonValue;

  details?: Prisma.JsonValue;

  ipAddress?: string;

  userAgent?: string;

  endpoint?: string;

  method?: string;

  statusCode?: number;

}) {

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

  } catch (error) {

    console.error(
      "Audit log failed:",
      error
    );

    return null;

  }

}
export function logPurchaseOrder(

  action: string,

  purchaseOrder: {
    id: number;
    purchaseOrderNumber: string;
  },

  userId: number,

  details?: Prisma.JsonValue

) {

  return log({

    userId,

    action,

    module:
      AuditModule.PURCHASE_ORDER,

    recordId:
      purchaseOrder.id.toString(),

    recordNumber:
      purchaseOrder.purchaseOrderNumber,

    details,

  });

}
/*
|--------------------------------------------------------------------------
| Goods Receipt Logger
|--------------------------------------------------------------------------
*/

export function logGoodsReceipt(

  action: string,

  receipt: {
    id: number;
    receiptNumber: string;
  },

  userId: number,

  details?: Prisma.JsonValue

) {

  return log({

    userId,

    action,

    module:
      AuditModule.GOODS_RECEIPT,

    recordId:
      receipt.id.toString(),

    recordNumber:
      receipt.receiptNumber,

    details,

  });

}

/*
|--------------------------------------------------------------------------
| Inventory Logger
|--------------------------------------------------------------------------
*/

export function logInventory(

  action: string,

  inventoryId: number,

  userId: number,

  details?: Prisma.JsonValue

) {

  return log({

    userId,

    action,

    module:
      AuditModule.INVENTORY_COUNT,

    recordId:
      inventoryId.toString(),

    details,

  });

}

/*
|--------------------------------------------------------------------------
| Payment Logger
|--------------------------------------------------------------------------
*/

export function logPayment(

  action: string,

  payment: {
    id: number;
    paymentNumber: string;
  },

  userId: number,

  details?: Prisma.JsonValue

) {

  return log({

    userId,

    action,

    module:
      AuditModule.PAYMENT,

    recordId:
      payment.id.toString(),

    recordNumber:
      payment.paymentNumber,

    details,

  });

}

/*
|--------------------------------------------------------------------------
| Refund Logger
|--------------------------------------------------------------------------
*/

export function logRefund(

  action: string,

  refund: {
    id: number;
    refundNumber?: string;
  },

  userId: number,

  details?: Prisma.JsonValue

) {

  return log({

    userId,

    action,

    module:
      AuditModule.REFUND,

    recordId:
      refund.id.toString(),

    recordNumber:
      refund.refundNumber,

    details,

  });

}

/*
|--------------------------------------------------------------------------
| Waybill Logger
|--------------------------------------------------------------------------
*/

export function logWaybill(

  action: string,

  waybill: {
    id: number;
    waybillNumber: string;
  },

  userId: number,

  details?: Prisma.JsonValue

) {

  return log({

    userId,

    action,

    module:
      AuditModule.WAYBILL,

    recordId:
      waybill.id.toString(),

    recordNumber:
      waybill.waybillNumber,

    details,

  });

}
/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {

  const auditLog =
    await repository.findById(id);

  if (!auditLog) {

    throw new AppError(
      "Audit log not found.",
      404
    );

  }

  return auditLog;

}

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export async function getAll(

  search?: string,

  module?: AuditModule,

  userId?: number,

  page = 1,

  limit = 20

) {

  const logs =
    await repository.findAll(
      search,
      module,
      userId,
      page,
      limit
    );

  const total =
    await repository.count(
      search,
      module,
      userId
    );

  return {

    data: logs,

    pagination: {

      page,

      limit,

      total,

      totalPages: Math.ceil(
        total / limit
      ),

    },

  };

}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {

  return repository.getStats();

}