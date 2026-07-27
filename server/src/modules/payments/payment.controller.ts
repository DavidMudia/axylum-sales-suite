// server/src/modules/payments/payment.controller.ts

import { Response, Request } from "express";
import * as service from "./payment.service";

export async function create(req: Request, res: Response): Promise<void> {
  const payment = await service.create(req.body, req.user!.id);
  res.status(201).json(payment);
}

export async function getAll(req: Request, res: Response): Promise<void> {
  const search = req.query.search as string | undefined;
  const status = req.query.status as any;
  const method = req.query.method as any;

  const customerId = req.query.customerId
    ? Number(req.query.customerId)
    : undefined;

  // ✅ NEW
  const refundable = req.query.refundable === "true";

  const page = req.query.page
    ? Number(req.query.page)
    : 1;

  const limit = req.query.limit
    ? Number(req.query.limit)
    : 20;

  const payments = await service.getAll(
    search,
    status,
    method,
    customerId,
    refundable,
    page,
    limit
  );

  res.json(payments);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  const payment = await service.getOne(id);

  res.json(payment);
}

export async function update(req: Request, res: Response): Promise<void> {
  const payment = await service.update(
    Number(req.params.id),
    req.body
  );

  res.json(payment);
}

export async function approve(req: Request, res: Response): Promise<void> {
  const payment = await service.approve(
    Number(req.params.id),
    req.user!.id
  );

  res.json(payment);
}

export async function cancel(req: Request, res: Response): Promise<void> {
  const payment = await service.cancel(
    Number(req.params.id),
    req.user!.id,
    req.body.reason
  );

  res.json(payment);
}

export async function stats(
  req: Request,
  res: Response
): Promise<void> {
  const data = await service.stats();

  res.json(data);
}