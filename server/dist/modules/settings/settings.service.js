"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = get;
exports.update = update;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function get(userId) {
    let settings = await prisma_1.default.setting.findUnique({
        where: {
            createdById: userId,
        },
    });
    if (!settings) {
        settings = await prisma_1.default.setting.create({
            data: {
                companyName: "My Company",
                industry: "",
                registrationNumber: "",
                taxNumber: "",
                email: "",
                phone: "",
                website: "",
                address: "",
                city: "",
                state: "",
                country: "",
                currency: "NGN",
                currencySymbol: "₦",
                tax: 0,
                quotePrefix: "QT",
                invoicePrefix: "INV",
                paymentPrefix: "PAY",
                expensePrefix: "EXP",
                quoteValidity: 30,
                invoiceDueDays: 30,
                decimalPlaces: 2,
                theme: "SYSTEM",
                primaryColor: "#2563eb",
                compactMode: false,
                sidebarCollapsed: false,
                fontSize: "MEDIUM",
                tableDensity: "COMFORTABLE",
                createdById: userId,
            },
        });
    }
    return settings;
}
async function update(userId, data) {
    return prisma_1.default.setting.upsert({
        where: {
            createdById: userId,
        },
        update: {
            ...data,
        },
        create: {
            companyName: data.companyName ?? "My Company",
            industry: data.industry ?? "",
            registrationNumber: data.registrationNumber ?? "",
            taxNumber: data.taxNumber ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            website: data.website ?? "",
            address: data.address ?? "",
            city: data.city ?? "",
            state: data.state ?? "",
            country: data.country ?? "",
            currency: data.currency ?? "NGN",
            currencySymbol: data.currencySymbol ?? "₦",
            tax: data.tax ?? 0,
            quotePrefix: data.quotePrefix ?? "QT",
            invoicePrefix: data.invoicePrefix ?? "INV",
            paymentPrefix: data.paymentPrefix ?? "PAY",
            expensePrefix: data.expensePrefix ?? "EXP",
            quoteValidity: data.quoteValidity ?? 30,
            invoiceDueDays: data.invoiceDueDays ?? 30,
            decimalPlaces: data.decimalPlaces ?? 2,
            theme: data.theme ?? "SYSTEM",
            primaryColor: data.primaryColor ??
                "#2563eb",
            compactMode: data.compactMode ?? false,
            sidebarCollapsed: data.sidebarCollapsed ?? false,
            fontSize: data.fontSize ?? "MEDIUM",
            tableDensity: data.tableDensity ??
                "COMFORTABLE",
            createdById: userId,
        },
    });
}
