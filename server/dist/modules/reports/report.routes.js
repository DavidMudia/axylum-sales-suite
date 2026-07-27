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
// server/src/modules/reports/report.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authorize_middleware_1 = require("../../middleware/authorize.middleware"); // ✅ added
const asyncHandler_1 = require("../../utils/asyncHandler");
const controller = __importStar(require("./report.controller"));
const router = (0, express_1.Router)();
// Main sales report
router.get("/sales", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.sales"), (0, asyncHandler_1.asyncHandler)(controller.getSalesReport));
// Export CSV
router.get("/sales/export", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.sales"), (0, asyncHandler_1.asyncHandler)(controller.exportSalesReport));
// Save report configuration
router.post("/sales/save", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.sales"), (0, asyncHandler_1.asyncHandler)(controller.saveReport));
// List saved reports
router.get("/sales/saved", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.sales"), (0, asyncHandler_1.asyncHandler)(controller.getSavedReports));
// Load a saved report
router.get("/sales/saved/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.sales"), (0, asyncHandler_1.asyncHandler)(controller.loadSavedReport));
exports.default = router;
router.get("/inventory", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.inventory"), (0, asyncHandler_1.asyncHandler)(controller.getInventoryReport));
router.get("/financial", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("report.financial"), (0, asyncHandler_1.asyncHandler)(controller.getFinancialReport));
