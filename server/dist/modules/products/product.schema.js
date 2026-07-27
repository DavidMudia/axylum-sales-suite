"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProductSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
// server/src/modules/products/product.schema.ts
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(200),
    description: zod_1.z.string().optional(),
    unit: zod_1.z.string(),
    costPrice: zod_1.z.coerce.number(),
    sellingPrice: zod_1.z.coerce.number(),
    currentStock: zod_1.z.coerce.number().default(0),
    minimumStock: zod_1.z.coerce.number().default(0),
    reorderLevel: zod_1.z.coerce.number().default(0).optional(),
    // ✅ REMOVE hasExpiryDate – not in the Prisma model
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.queryProductSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
});
