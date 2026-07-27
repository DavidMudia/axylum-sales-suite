"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = void 0;
const zod_1 = require("zod");
exports.updateSettingsSchema = zod_1.z.object({
    // Business
    companyName: zod_1.z.string().min(2).optional(),
    industry: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    taxNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    // Finance
    currency: zod_1.z.string().optional(),
    currencySymbol: zod_1.z.string().optional(),
    tax: zod_1.z.number().optional(),
    quotePrefix: zod_1.z.string().optional(),
    invoicePrefix: zod_1.z.string().optional(),
    paymentPrefix: zod_1.z.string().optional(),
    expensePrefix: zod_1.z.string().optional(),
    quoteValidity: zod_1.z.number().optional(),
    invoiceDueDays: zod_1.z.number().optional(),
    decimalPlaces: zod_1.z.number().optional(),
    // Appearance
    theme: zod_1.z
        .enum(["LIGHT", "DARK", "SYSTEM"])
        .optional(),
    primaryColor: zod_1.z.string().optional(),
    compactMode: zod_1.z.boolean().optional(),
    sidebarCollapsed: zod_1.z.boolean().optional(),
    fontSize: zod_1.z
        .enum(["SMALL", "MEDIUM", "LARGE"])
        .optional(),
    tableDensity: zod_1.z
        .enum([
        "COMPACT",
        "COMFORTABLE",
        "SPACIOUS",
    ])
        .optional(),
});
