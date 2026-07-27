import { Router } from "express";

import * as controller from "./permission.controller";

import {
  authenticate,
} from "../../middleware/auth.middleware";

import { requirePermission } from "../../middleware/authorize.middleware";

import {
  validate,
} from "../../middleware/validate.middleware";

import {
  createPermissionSchema,
} from "./permission.schema";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission(
    "permission.read"
  ),
  controller.getAll
);

router.post(
  "/",
  authenticate,
  requirePermission(
    "permission.create"
  ),
  validate(
    createPermissionSchema
  ),
  controller.create
);

router.delete(
  "/:id",
  authenticate,
  requirePermission(
    "permission.delete"
  ),
  controller.remove
);

export default router;