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
const controller = __importStar(require("./expense.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authorize_middleware_1 = require("../../middleware/authorize.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const expense_schema_1 = require("./expense.schema");
console.log('🔍 Expenses controller:', controller);
const router = (0, express_1.Router)();
router.get("/stats", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("expenses.read"), (0, asyncHandler_1.asyncHandler)(controller.stats));
router.get("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("expenses.read"), (0, asyncHandler_1.asyncHandler)(controller.getAll));
router.get("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("expenses.read"), (0, asyncHandler_1.asyncHandler)(controller.getOne));
router.post("/", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("expenses.create"), (0, validate_middleware_1.validate)(expense_schema_1.createExpenseSchema), (0, asyncHandler_1.asyncHandler)(controller.create));
router.patch("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("expenses.update"), (0, validate_middleware_1.validate)(expense_schema_1.updateExpenseSchema), (0, asyncHandler_1.asyncHandler)(controller.update));
router.delete("/:id", auth_middleware_1.authenticate, (0, authorize_middleware_1.requirePermission)("expenses.delete"), (0, asyncHandler_1.asyncHandler)(controller.remove));
exports.default = router;
