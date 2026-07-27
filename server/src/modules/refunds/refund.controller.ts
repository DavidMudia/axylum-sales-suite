import { Request, Response } from "express";

import * as service from "./refund.service";

import catchAsync from "../../utils/catchAsync";

/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/

export const create =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const refund =
        await service.create(
          req.body,
          req.user!.id
        );

      res.status(201).json({
        success: true,
        message:
          "Refund created successfully.",
        data: refund,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Get All Refunds
|--------------------------------------------------------------------------
*/

export const getAll =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await service.getAll(
          req.query.search as string,

          req.query.status as any,

          req.query.customerId
            ? Number(
                req.query.customerId
              )
            : undefined,

          req.query.page
            ? Number(req.query.page)
            : 1,

          req.query.limit
            ? Number(req.query.limit)
            : 20
        );

      res.json({
        success: true,
        ...result,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Get Refund
|--------------------------------------------------------------------------
*/

export const getOne =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const refund =
        await service.getOne(
          Number(req.params.id)
        );

      res.json({
        success: true,
        data: refund,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/

export const approve =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const refund =
        await service.approve(
          Number(req.params.id),

          req.user!.id,

          req.body.approvalNote
        );

      res.json({
        success: true,
        message:
          "Refund approved successfully.",
        data: refund,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/

export const reject =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const refund =
  await service.reject(
    Number(req.params.id),
    req.body.reason,
    req.user!.id
  );

      res.json({
        success: true,
        message:
          "Refund rejected.",
        data: refund,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Refund Statistics
|--------------------------------------------------------------------------
*/

export const stats =
  catchAsync(
    async (
      req: Request,
      res: Response
    ) => {
      const data =
        await service.stats();

      res.json({
        success: true,
        data,
      });
    }
  );
  