import { z } from "zod";
import { WaybillStatus } from "@prisma/client";

export const createWaybillSchema = z.object({

  invoiceId:
    z.coerce.number().int().positive(),

  warehouseId:
    z.coerce.number().int().positive(),

  vehicleId:
    z.coerce.number().int().positive(),

  driverId:
    z.coerce.number().int().positive(),

  destination:
    z.string().min(3),

});

export type CreateWaybillInput =
  z.infer<typeof createWaybillSchema>;

export const updateWaybillStatusSchema =
  z.object({

    status:
      z.nativeEnum(WaybillStatus),

  });

export type UpdateWaybillStatusInput =
  z.infer<typeof updateWaybillStatusSchema>;