import { Request, Response } from "express";

import * as service from "./order.service";

export async function create(
  req: Request,
  res: Response
) {
  const order = await service.create(
    req.body,
    req.user!.id
  );

  return res.status(201).json({
    message: "Sales order created successfully.",
    order,
  });
}

export async function getAll(req: Request, res: Response) {
  console.log("GET /orders query:", req.query); // 👈 see what filters are sent
  const search = req.query.search as string | undefined;
  const status = req.query.status as any;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const orders = await service.getAll(
    search,
    status,
    undefined,
    page,
    limit
);
  return res.json(orders);
}
export async function getOne(
  req: Request,
  res: Response
) {
  const order =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(order);
}

export async function update(
  req: Request,
  res: Response
) {
  const order =
    await service.update(
      Number(req.params.id),
      req.body
    );

  return res.json({
    message: "Sales order updated.",
    order,
  });
}

export async function remove(
  req: Request,
  res: Response
) {
  await service.remove(
    Number(req.params.id)
  );

  return res.json({
    message: "Sales order deleted.",
  });
}

export async function restore(
  req: Request,
  res: Response
) {
  const order =
    await service.restore(
      Number(req.params.id)
    );

  return res.json({
    message: "Sales order restored.",
    order,
  });
}

export async function approve(
  req: Request,
  res: Response
) {
  const order =
    await service.approve(
      Number(req.params.id),
      req.user!.id
    );

  return res.json({
    message: "Sales order approved.",
    order,
  });
}

export async function cancel(
  req: Request,
  res: Response
) {
  const order =
    await service.cancel(
      Number(req.params.id),
      req.user!.id,
      req.body.reason
    );

  return res.json({
    message: "Sales order cancelled.",
    order,
  });
}

export async function stats(
  req: Request,
  res: Response
) {
  const data =
    await service.stats();

  return res.json(data);
}
export async function convertFromQuote(req: Request, res: Response) {
  const order = await service.convertFromQuote(Number(req.params.quoteId), req.user!.id);
  return res.status(201).json({
    message: "Sales order created from quote successfully.",
    order,
  });
}