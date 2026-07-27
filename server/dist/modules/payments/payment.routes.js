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
// server/src/modules/payments/payment.routes.ts
const express_1 = require("express");
const controller = __importStar(require("./payment.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authorize_middleware_1 = require("../../middleware/authorize.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const payment_schema_1 = require("./payment.schema");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/
router.get("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.read"), (0, asyncHandler_1.asyncHandler)(controller.getAll));
router.get("/stats", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.read"), (0, asyncHandler_1.asyncHandler)(controller.stats));
/*
|--------------------------------------------------------------------------
| Get Single Payment
|--------------------------------------------------------------------------
*/
router.get("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.read"), (0, asyncHandler_1.asyncHandler)(controller.getOne));
/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/
router.post("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.create"), (0, validate_middleware_1.validate)(payment_schema_1.createPaymentSchema), (0, asyncHandler_1.asyncHandler)(controller.create));
/*
|--------------------------------------------------------------------------
| Update Payment
|--------------------------------------------------------------------------
*/
router.patch("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.update"), (0, validate_middleware_1.validate)(payment_schema_1.updatePaymentSchema), (0, asyncHandler_1.asyncHandler)(controller.update));
/*
|--------------------------------------------------------------------------
| Approve Payment
|--------------------------------------------------------------------------
*/
router.patch("/:id/approve", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.approve"), (0, validate_middleware_1.validate)(payment_schema_1.approvePaymentSchema), (0, asyncHandler_1.asyncHandler)(controller.approve));
/*
|--------------------------------------------------------------------------
| Cancel Payment
|--------------------------------------------------------------------------
*/
router.patch("/:id/cancel", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("payment.cancel"), (0, validate_middleware_1.validate)(payment_schema_1.cancelPaymentSchema), (0, asyncHandler_1.asyncHandler)(controller.cancel));
exports.default = router;
