"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goods_receipt_controller_1 = require("./goods-receipt.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const goods_receipts_schema_1 = require("./goods-receipts.schema");
const authorize_middleware_1 = require("../../middleware/authorize.middleware");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
router.get("/dashboard", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.read"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.dashboard));
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
router.get("/stats", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.read"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.stats));
/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/
router.get("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.read"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.getAll));
/*
|--------------------------------------------------------------------------
| Single
|--------------------------------------------------------------------------
*/
router.get("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.read"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.getOne));
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
router.post("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.create"), (0, validate_middleware_1.validate)(goods_receipts_schema_1.createGoodsReceiptSchema), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.create));
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
router.patch("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.create"), (0, validate_middleware_1.validate)(goods_receipts_schema_1.updateGoodsReceiptSchema), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.update));
/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/
router.patch("/:id/verify", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.approve"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.verify));
/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/
router.patch("/:id/restore", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.create"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.restore));
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/
router.delete("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("goods-receipt.create"), (0, asyncHandler_1.asyncHandler)(goods_receipt_controller_1.remove));
exports.default = router;
