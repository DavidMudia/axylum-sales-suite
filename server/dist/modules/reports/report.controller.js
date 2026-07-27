"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesReport = getSalesReport;
exports.exportSalesReport = exportSalesReport;
exports.saveReport = saveReport;
exports.getSavedReports = getSavedReports;
exports.loadSavedReport = loadSavedReport;
exports.getInventoryReport = getInventoryReport;
exports.getFinancialReport = getFinancialReport;
const financialService = __importStar(require("./financial.service"));
const reportService = __importStar(require("./report.service")); // ✅ namespace import avoids conflict
const sync_1 = require("csv-stringify/sync");
async function getSalesReport(req, res) {
    const { startDate, endDate, customerId, productId, warehouseId } = req.query;
    const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        customerId: customerId ? Number(customerId) : undefined,
        productId: productId ? Number(productId) : undefined,
        warehouseId: warehouseId ? Number(warehouseId) : undefined,
    };
    const data = await reportService.getSalesReport(filters);
    res.json(data);
}
async function exportSalesReport(req, res) {
    const { startDate, endDate, customerId, productId, warehouseId } = req.query;
    const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        customerId: customerId ? Number(customerId) : undefined,
        productId: productId ? Number(productId) : undefined,
        warehouseId: warehouseId ? Number(warehouseId) : undefined,
    };
    const data = await reportService.getSalesReport(filters);
    const rows = data.orders.map((order) => ({
        "Order #": order.orderNumber,
        Customer: order.customer.name,
        Total: order.total,
        Status: order.status,
        Date: order.createdAt.toISOString().slice(0, 10),
    }));
    const csv = (0, sync_1.stringify)(rows, { header: true });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=sales_report.csv");
    res.send(csv);
}
async function saveReport(req, res) {
    const { name, filters } = req.body;
    const report = await reportService.saveReport(name, filters, req.user.id);
    res.status(201).json(report);
}
async function getSavedReports(req, res) {
    const reports = await reportService.getSavedReports(req.user.id);
    res.json(reports);
}
async function loadSavedReport(req, res) {
    const reportId = Number(req.params.id);
    const data = await reportService.loadSavedReport(reportId, req.user.id);
    res.json(data);
}
async function getInventoryReport(req, res) {
    const { startDate, endDate, warehouseId } = req.query;
    const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        warehouseId: warehouseId ? Number(warehouseId) : undefined,
    };
    const data = await reportService.getInventoryReport(filters);
    res.json(data);
}
async function getFinancialReport(req, res) {
    const { startDate, endDate, branchId } = req.query;
    const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        branchId: branchId ? Number(branchId) : undefined,
    };
    const data = await financialService.getFinancialReport(filters);
    res.json(data);
}
