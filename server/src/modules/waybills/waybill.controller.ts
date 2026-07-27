// server/src/modules/waybills/waybill.controller.ts
import { Request, Response } from "express";
import * as service from "./waybill.service";

/*
|--------------------------------------------------------------------------
| Create Waybill
|--------------------------------------------------------------------------
*/

export async function create(req: Request, res: Response) {
  const waybill = await service.create(req.body, req.user!.id);
  return res.status(201).json({
    message: "Waybill created successfully.",
    waybill,
  });
}

/*
|--------------------------------------------------------------------------
| Get All Waybills
|--------------------------------------------------------------------------
*/

export async function getAll(req: Request, res: Response) {
  const search = req.query.search as string | undefined;
  const status = req.query.status as any;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const waybills = await service.getAll(search, status, page, limit);
  return res.json(waybills);
}

/*
|--------------------------------------------------------------------------
| Get Single Waybill
|--------------------------------------------------------------------------
*/

export async function getOne(req: Request, res: Response) {
  const waybill = await service.getOne(Number(req.params.id));
  return res.json(waybill);
}

/*
|--------------------------------------------------------------------------
| Update Waybill Status
|--------------------------------------------------------------------------
*/

export async function updateStatus(req: Request, res: Response) {
  const waybill = await service.updateStatus(
    Number(req.params.id),
    req.body.status,
    req.user!.id
  );
  return res.json({
    message: "Waybill status updated successfully.",
    waybill,
  });
}

/*
|--------------------------------------------------------------------------
| Waybill Statistics
|--------------------------------------------------------------------------
*/

export async function stats(req: Request, res: Response) {
  const statistics = await service.stats();
  return res.json(statistics);
}