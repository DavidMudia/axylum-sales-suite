"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWaybillStatusSchema = exports.createWaybillSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createWaybillSchema = zod_1.z.object({
    invoiceId: zod_1.z.coerce.number().int().positive(),
    warehouseId: zod_1.z.coerce.number().int().positive(),
    vehicleId: zod_1.z.coerce.number().int().positive(),
    driverId: zod_1.z.coerce.number().int().positive(),
    destination: zod_1.z.string().min(3),
});
exports.updateWaybillStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.WaybillStatus),
});
