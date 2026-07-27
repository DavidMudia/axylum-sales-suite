// server/src/modules/settings/settings.controller.ts
import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export async function getSettings(req: Request, res: Response) {
  const userId = req.user.id;
  let settings = await prisma.setting.findUnique({ where: { createdById: userId } });
  if (!settings) {
    settings = await prisma.setting.create({
      data: {
        companyName: "My Company",
        currency: "NGN",
        currencySymbol: "₦",
        createdBy: { connect: { id: userId } },
        theme: "SYSTEM",
        primaryColor: "#2563eb",
        fontSize: "MEDIUM",
        tableDensity: "COMFORTABLE",
        compactMode: false,
        sidebarCollapsed: false,
      },
    });
  }
  res.json(settings);
}

export async function updateSettings(req: Request, res: Response) {
  const userId = req.user.id;
  const data = req.body;

  // Find existing settings
  const settings = await prisma.setting.findUnique({ where: { createdById: userId } });
  if (!settings) {
    throw new AppError("Settings not found.", 404);
  }

  // Update with all provided fields
  const updated = await prisma.setting.update({
    where: { id: settings.id },
    data: {
      // Appearance fields
      theme: data.theme,
      primaryColor: data.primaryColor,
      fontSize: data.fontSize,
      tableDensity: data.tableDensity,
      compactMode: data.compactMode,
      sidebarCollapsed: data.sidebarCollapsed,
      // Also allow other fields (general, finance, etc.)
      companyName: data.companyName,
      industry: data.industry,
      registrationNumber: data.registrationNumber,
      taxNumber: data.taxNumber,
      email: data.email,
      phone: data.phone,
      website: data.website,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      tax: data.tax,
      quotePrefix: data.quotePrefix,
      invoicePrefix: data.invoicePrefix,
      paymentPrefix: data.paymentPrefix,
      expensePrefix: data.expensePrefix,
      quoteValidity: data.quoteValidity,
      invoiceDueDays: data.invoiceDueDays,
      decimalPlaces: data.decimalPlaces,
      timezone: data.timezone,
      dateFormat: data.dateFormat,
      timeFormat: data.timeFormat,
    },
  });

  res.json(updated);
}