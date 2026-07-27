import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  stats,
} from "./audit-log.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middleware/validate.middleware";

import {
  createAuditLogSchema,
} from "./audit-log.schema";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  authenticate,
  asyncHandler(stats)
);

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  asyncHandler(getAll)
);

/*
|--------------------------------------------------------------------------
| Single
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  asyncHandler(getOne)
);

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

router.post(
  "/",
  authenticate,
  validate(createAuditLogSchema),
  asyncHandler(create)
);

export default router;