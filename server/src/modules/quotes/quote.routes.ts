import { Router } from "express";

import * as controller from "./quote.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middleware/validate.middleware";

import { createQuoteSchema } from "./quote.schema";

const router = Router();

router.get(
  "/",
  authenticate,
  asyncHandler(controller.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(controller.getOne)
);

router.post(
  "/",
  authenticate,
  validate(createQuoteSchema),
  asyncHandler(controller.create)
);
router.patch(
  "/:id/approve",
  authenticate,
  asyncHandler(controller.approve)
);

router.patch(
  "/:id/reject",
  authenticate,
  asyncHandler(controller.reject)
);

router.post(
  "/:id/convert",
  authenticate,
  asyncHandler(controller.convertToInvoice)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(controller.remove)
);

export default router;