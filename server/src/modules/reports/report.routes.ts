// server/src/modules/reports/report.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware"; // ✅ added
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./report.controller";

const router = Router();

// Main sales report
router.get(
  "/sales",
  authenticate,
  requirePermission("report.sales"),
  asyncHandler(controller.getSalesReport)
);

// Export CSV
router.get(
  "/sales/export",
  authenticate,
  requirePermission("report.sales"),
  asyncHandler(controller.exportSalesReport)
);

// Save report configuration
router.post(
  "/sales/save",
  authenticate,
  requirePermission("report.sales"),
  asyncHandler(controller.saveReport)
);

// List saved reports
router.get(
  "/sales/saved",
  authenticate,
  requirePermission("report.sales"),
  asyncHandler(controller.getSavedReports)
);

// Load a saved report
router.get(
  "/sales/saved/:id",
  authenticate,
  requirePermission("report.sales"),
  asyncHandler(controller.loadSavedReport)
);

export default router;
router.get(
  "/inventory",
  authenticate,
  requirePermission("report.inventory"),
  asyncHandler(controller.getInventoryReport)
);
router.get(
  "/financial",
  authenticate,
  requirePermission("report.financial"),
  asyncHandler(controller.getFinancialReport)
);