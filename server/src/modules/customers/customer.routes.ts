import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  stats,
} from "./customer.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";

import { createCustomerSchema } from "./customer.schema";

const router = Router();

router.get(
  "/stats",
  authenticate,
  asyncHandler(stats)
);

router.get(
  "/",
  authenticate,
  asyncHandler(getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(getOne)
);

router.post(
  "/",
  authenticate,
  validate(createCustomerSchema),
  asyncHandler(create)
);

router.patch(
  "/:id",
  authenticate,
  asyncHandler(update)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(remove)
);

export default router;