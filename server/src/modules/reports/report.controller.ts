// server/src/modules/reports/report.controller.ts
import { Request, Response } from "express";
import * as financialService from "./financial.service";
import * as reportService from "./report.service"; // ✅ namespace import avoids conflict
import { stringify } from "csv-stringify/sync";

export async function getSalesReport(req: Request, res: Response) {
  const { startDate, endDate, customerId, productId, warehouseId } = req.query;
  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    customerId: customerId ? Number(customerId) : undefined,
    productId: productId ? Number(productId) : undefined,
    warehouseId: warehouseId ? Number(warehouseId) : undefined,
  };
  const data = await reportService.getSalesReport(filters);
  res.json(data);
}

export async function exportSalesReport(req: Request, res: Response) {
  const { startDate, endDate, customerId, productId, warehouseId } = req.query;
  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    customerId: customerId ? Number(customerId) : undefined,
    productId: productId ? Number(productId) : undefined,
    warehouseId: warehouseId ? Number(warehouseId) : undefined,
  };
  const data = await reportService.getSalesReport(filters);
  const rows = data.orders.map((order: any) => ({
    "Order #": order.orderNumber,
    Customer: order.customer.name,
    Total: order.total,
    Status: order.status,
    Date: order.createdAt.toISOString().slice(0, 10),
  }));
  const csv = stringify(rows, { header: true });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=sales_report.csv");
  res.send(csv);
}

export async function saveReport(req: Request, res: Response) {
  const { name, filters } = req.body;
  const report = await reportService.saveReport(name, filters, req.user.id);
  res.status(201).json(report);
}

export async function getSavedReports(req: Request, res: Response) {
  const reports = await reportService.getSavedReports(req.user.id);
  res.json(reports);
}

export async function loadSavedReport(req: Request, res: Response) {
  const reportId = Number(req.params.id);
  const data = await reportService.loadSavedReport(reportId, req.user.id);
  res.json(data);
}
export async function getInventoryReport(req: Request, res: Response) {
  const { startDate, endDate, warehouseId } = req.query;
  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    warehouseId: warehouseId ? Number(warehouseId) : undefined,
  };
  const data = await reportService.getInventoryReport(filters);
  res.json(data);
}
export async function getFinancialReport(req: Request, res: Response) {
  const { startDate, endDate, branchId } = req.query;
  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    branchId: branchId ? Number(branchId) : undefined,
  };
  const data = await financialService.getFinancialReport(filters);
  res.json(data);
}