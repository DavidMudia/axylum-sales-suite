import { Router } from "express";
import * as controller from "./expense.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { createExpenseSchema, updateExpenseSchema } from "./expense.schema";
console.log('🔍 Expenses controller:', controller);

const router = Router();

router.get("/stats", authenticate, requirePermission("expenses.read"), asyncHandler(controller.stats));
router.get("/", authenticate, requirePermission("expenses.read"), asyncHandler(controller.getAll));
router.get("/:id", authenticate, requirePermission("expenses.read"), asyncHandler(controller.getOne));
router.post("/", authenticate, requirePermission("expenses.create"), validate(createExpenseSchema), asyncHandler(controller.create));
router.patch("/:id", authenticate, requirePermission("expenses.update"), validate(updateExpenseSchema), asyncHandler(controller.update));
router.delete("/:id", authenticate, requirePermission("expenses.delete"), asyncHandler(controller.remove));

export default router;