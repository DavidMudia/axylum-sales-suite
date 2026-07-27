"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWarehouseSchema = exports.createWarehouseSchema = void 0;
const zod_1 = require("zod");
/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/
exports.createWarehouseSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(100),
    code: zod_1.z
        .string()
        .min(2)
        .max(20),
    description: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    managerName: zod_1.z.string().optional(),
    isPrimary: zod_1.z.boolean().optional(),
});
/*
|--------------------------------------------------------------------------
| Update Warehouse
|--------------------------------------------------------------------------
*/
exports.updateWarehouseSchema = exports.createWarehouseSchema.partial();
