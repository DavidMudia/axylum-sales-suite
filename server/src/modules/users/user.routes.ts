// server/src/modules/users/user.routes.ts
import { Router } from "express";
import * as controller from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
} from "./user.schema";

const router = Router();

// Statistics
router.get(
  "/stats",
  authenticate,
  requirePermission("users.read"),
  asyncHandler(controller.stats)
);

// Get all users
router.get(
  "/",
  authenticate,
  requirePermission("users.read"),
  asyncHandler(controller.getAll)
);

// Get single user
router.get(
  "/:id",
  authenticate,
  requirePermission("users.read"),
  asyncHandler(controller.getOne)
);

// Create user
router.post(
  "/",
  authenticate,
  requirePermission("users.create"),
  validate(createUserSchema),
  asyncHandler(controller.create)
);

// Update user
router.patch(
  "/:id",
  authenticate,
  requirePermission("users.update"),
  validate(updateUserSchema),
  asyncHandler(controller.update)
);

// Change password
router.patch(
  "/:id/change-password",
  authenticate,
  requirePermission("users.update"),
  validate(changePasswordSchema),
  asyncHandler(controller.changePassword)
);

// Activate user
router.patch(
  "/:id/activate",
  authenticate,
  requirePermission("users.update"),
  asyncHandler(controller.activate)
);

// Deactivate user
router.patch(
  "/:id/deactivate",
  authenticate,
  requirePermission("users.update"),
  asyncHandler(controller.deactivate)
);

// Restore user
router.patch(
  "/:id/restore",
  authenticate,
  requirePermission("users.delete"),
  asyncHandler(controller.restore)
);

// Delete user
router.delete(
  "/:id",
  authenticate,
  requirePermission("users.delete"),
  asyncHandler(controller.remove)
);
// server/src/modules/users/user.routes.ts
router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(controller.changePassword)
);
export default router;