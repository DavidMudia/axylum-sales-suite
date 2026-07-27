"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySupplierSchema = exports.updateSupplierSchema = exports.createSupplierSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/
exports.createSupplierSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(200),
    companyName: zod_1.z.string().optional(),
    contactPerson: zod_1.z.string().optional(),
    email: zod_1.z
        .string()
        .email()
        .optional()
        .or(zod_1.z.literal("")),
    phone: zod_1.z.string().min(5),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    status: zod_1.z
        .nativeEnum(client_1.SupplierStatus)
        .optional(),
});
/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/
exports.updateSupplierSchema = exports.createSupplierSchema.partial();
/*
|--------------------------------------------------------------------------
| Query Supplier
|--------------------------------------------------------------------------
*/
exports.querySupplierSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z
        .nativeEnum(client_1.SupplierStatus)
        .optional(),
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
