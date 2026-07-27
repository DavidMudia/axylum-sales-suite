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
const express_1 = require("express");
const controller = __importStar(require("./product.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authorize_middleware_1 = require("../../middleware/authorize.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const product_schema_1 = require("./product.schema");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/
router.get("/low-stock", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.read"), (0, asyncHandler_1.asyncHandler)(controller.lowStock));
/*
|--------------------------------------------------------------------------
| Get Products
|--------------------------------------------------------------------------
*/
router.get("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.read"), (0, validate_middleware_1.validate)(product_schema_1.queryProductSchema, 'query'), // ✅ added 'query'
(0, asyncHandler_1.asyncHandler)(controller.getAll));
/*
|--------------------------------------------------------------------------
| Get Product
|--------------------------------------------------------------------------
*/
router.get("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.read"), (0, asyncHandler_1.asyncHandler)(controller.getOne));
/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/
router.post("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.create"), (0, validate_middleware_1.validate)(product_schema_1.createProductSchema), (0, asyncHandler_1.asyncHandler)(controller.create));
/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/
router.patch("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.update"), (0, validate_middleware_1.validate)(product_schema_1.updateProductSchema), (0, asyncHandler_1.asyncHandler)(controller.update));
/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/
router.delete("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.delete"), (0, asyncHandler_1.asyncHandler)(controller.remove));
/*
|--------------------------------------------------------------------------
| Restore Product
|--------------------------------------------------------------------------
*/
router.patch("/:id/restore", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("inventory.update"), (0, asyncHandler_1.asyncHandler)(controller.restore));
exports.default = router;
