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
// server/src/modules/purchase-orders/purchase-order.routes.ts
const express_1 = require("express");
const controller = __importStar(require("./purchase-order.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authorize_middleware_1 = require("../../middleware/authorize.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const purchase_order_schema_1 = require("./purchase-order.schema");
const router = (0, express_1.Router)();
// Stats
router.get('/stats', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.read'), (0, asyncHandler_1.asyncHandler)(controller.stats));
// List
router.get('/', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.read'), (0, validate_middleware_1.validate)(purchase_order_schema_1.queryPurchaseOrderSchema, 'query'), (0, asyncHandler_1.asyncHandler)(controller.getAll));
// Get one
router.get('/:id', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.read'), (0, asyncHandler_1.asyncHandler)(controller.getOne));
// Create
router.post('/', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.create'), (0, validate_middleware_1.validate)(purchase_order_schema_1.createPurchaseOrderSchema), (0, asyncHandler_1.asyncHandler)(controller.create));
// Update
router.patch('/:id', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.update'), (0, validate_middleware_1.validate)(purchase_order_schema_1.updatePurchaseOrderSchema), (0, asyncHandler_1.asyncHandler)(controller.update));
// Delete
router.delete('/:id', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.delete'), (0, asyncHandler_1.asyncHandler)(controller.remove));
// Restore
router.patch('/:id/restore', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.update'), (0, asyncHandler_1.asyncHandler)(controller.restore));
// Approve
router.patch('/:id/approve', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.approve'), (0, asyncHandler_1.asyncHandler)(controller.approve));
// Cancel
router.patch('/:id/cancel', auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)('purchase_order.cancel'), (0, asyncHandler_1.asyncHandler)(controller.cancel));
exports.default = router; // ✅ MUST HAVE THIS
