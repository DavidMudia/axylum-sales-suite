"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCustomerSchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(200),
    companyName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(7).max(20).optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    status: zod_1.z
        .nativeEnum(client_1.CustomerStatus)
        .optional(),
    notes: zod_1.z.string().optional(),
});
/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/
exports.updateCustomerSchema = exports.createCustomerSchema.partial();
/*
|--------------------------------------------------------------------------
| Query Customers
|--------------------------------------------------------------------------
*/
exports.queryCustomerSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
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
