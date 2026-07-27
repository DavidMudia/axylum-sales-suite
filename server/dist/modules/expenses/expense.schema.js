"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseSchema = zod_1.z.object({
    description: zod_1.z.string().min(1).max(500),
    category: zod_1.z.enum(['TRANSPORTATION', 'FUEL', 'STAFF', 'REPAIRS', 'MARKETING', 'UTILITIES', 'OTHER']),
    amount: zod_1.z.number().positive(),
    date: zod_1.z.coerce.date(),
    reference: zod_1.z.string().optional(),
});
exports.updateExpenseSchema = exports.createExpenseSchema.partial();
