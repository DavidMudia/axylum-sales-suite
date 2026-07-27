// server/src/modules/roles/role.routes.ts
import { Router } from "express";
import * as controller from "./role.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { createRoleSchema, updateRoleSchema } from "./role.schema";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("roles.read"),
  asyncHandler(controller.getRoles)
);

router.post(
  "/",
  authenticate,
  requirePermission("roles.create"),
  validate(createRoleSchema),
  asyncHandler(controller.createRole)
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("roles.update"),
  validate(updateRoleSchema),
  asyncHandler(controller.updateRole)
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("roles.delete"),
  asyncHandler(controller.deleteRole)
);

export default router;