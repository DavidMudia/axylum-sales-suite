import prisma from "../../lib/prisma";
import { UpdateSettingsInput } from "./settings.schema";

export async function get(userId: number) {
  let settings = await prisma.setting.findUnique({
    where: {
      createdById: userId,
    },
  });

  if (!settings) {
    settings = await prisma.setting.create({
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

export async function update(
  userId: number,
  data: UpdateSettingsInput
) {
  return prisma.setting.upsert({
    where: {
      createdById: userId,
    },

    update: {
      ...data,
    },

    create: {
      companyName: data.companyName ?? "My Company",

      industry: data.industry ?? "",
      registrationNumber:
        data.registrationNumber ?? "",
      taxNumber: data.taxNumber ?? "",

      email: data.email ?? "",
      phone: data.phone ?? "",
      website: data.website ?? "",

      address: data.address ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      country: data.country ?? "",

      currency: data.currency ?? "NGN",
      currencySymbol:
        data.currencySymbol ?? "₦",

      tax: data.tax ?? 0,

      quotePrefix:
        data.quotePrefix ?? "QT",
      invoicePrefix:
        data.invoicePrefix ?? "INV",
      paymentPrefix:
        data.paymentPrefix ?? "PAY",
      expensePrefix:
        data.expensePrefix ?? "EXP",

      quoteValidity:
        data.quoteValidity ?? 30,

      invoiceDueDays:
        data.invoiceDueDays ?? 30,

      decimalPlaces:
        data.decimalPlaces ?? 2,

      theme:
        data.theme ?? "SYSTEM",

      primaryColor:
        data.primaryColor ??
        "#2563eb",

      compactMode:
        data.compactMode ?? false,

      sidebarCollapsed:
        data.sidebarCollapsed ?? false,

      fontSize:
        data.fontSize ?? "MEDIUM",

      tableDensity:
        data.tableDensity ??
        "COMFORTABLE",

      createdById: userId,
    },
  });
}