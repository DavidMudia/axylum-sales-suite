"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQuerySchema = void 0;
const zod_1 = require("zod");
/*
|--------------------------------------------------------------------------
| Date Range
|--------------------------------------------------------------------------
*/
exports.reportQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    customerId: zod_1.z.coerce.number().int().positive().optional(),
    supplierId: zod_1.z.coerce.number().int().positive().optional(),
    warehouseId: zod_1.z.coerce.number().int().positive().optional(),
    salespersonId: zod_1.z.coerce.number().int().positive().optional(),
});
