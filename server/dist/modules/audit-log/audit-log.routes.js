"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_log_controller_1 = require("./audit-log.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const audit_log_schema_1 = require("./audit-log.schema");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
router.get("/stats", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(audit_log_controller_1.stats));
/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/
router.get("/", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(audit_log_controller_1.getAll));
/*
|--------------------------------------------------------------------------
| Single
|--------------------------------------------------------------------------
*/
router.get("/:id", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(audit_log_controller_1.getOne));
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
|
| This endpoint is mainly for internal use/testing.
| In production, audit logs should be created automatically
| through auditLogService.log().
|--------------------------------------------------------------------------
*/
router.post("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(audit_log_schema_1.createAuditLogSchema), (0, asyncHandler_1.asyncHandler)(audit_log_controller_1.create));
exports.default = router;
