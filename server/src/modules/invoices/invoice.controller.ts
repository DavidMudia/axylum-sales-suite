import { Request, Response } from "express";

import * as service from "./invoice.service";

/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {
  const invoice =
    await service.create(
      req.body,
      req.user!.id
    );

  return res.status(201).json({
    message:
      "Invoice created successfully.",
    invoice,
  });
}

/*
|--------------------------------------------------------------------------
| Convert Sales Order → Invoice
|--------------------------------------------------------------------------
*/

export async function convertFromSalesOrder(
  req: Request,
  res: Response
) {
  const invoice =
    await service.convertFromSalesOrder(
      Number(req.params.salesOrderId),
      req.user!.id
    );

  return res.status(201).json({
    message:
      "Invoice generated successfully.",
    invoice,
  });
}

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export async function getAll(
  req: Request,
  res: Response
) {
  const search =
    req.query.search as string | undefined;

  const status =
    req.query.status as any;

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) || 20;

  const invoices =
    await service.getAll(
      search,
      status,
      page,
      limit
    );

  return res.json(invoices);
}

/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/

export async function getOne(
  req: Request,
  res: Response
) {
  const invoice =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(invoice);
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function update(
  req: Request,
  res: Response
) {
  const invoice =
    await service.update(
      Number(req.params.id),
      req.body
    );

  return res.json({
    message:
      "Invoice updated successfully.",
    invoice,
  });
}

/*
|--------------------------------------------------------------------------
| Approve
|--------------------------------------------------------------------------
*/

export async function approve(
  req: Request,
  res: Response
) {
  const invoice =
    await service.approve(
      Number(req.params.id),
      req.user!.id,
      req.body.note
    );

  return res.json({
    message:
      "Invoice approved successfully.",
    invoice,
  });
}

/*
|--------------------------------------------------------------------------
| Mark Printed
|--------------------------------------------------------------------------
*/

export async function markPrinted(
  req: Request,
  res: Response
) {
  const invoice =
    await service.markPrinted(
      Number(req.params.id)
    );

  return res.json({
    message:
      "Invoice marked as printed.",
    invoice,
  });
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function remove(
  req: Request,
  res: Response
) {
  await service.remove(
    Number(req.params.id)
  );

  return res.json({
    message:
      "Invoice deleted successfully.",
  });
}

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export async function restore(
  req: Request,
  res: Response
) {
  const invoice =
    await service.restore(
      Number(req.params.id)
    );

  return res.json({
    message:
      "Invoice restored successfully.",
    invoice,
  });
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function stats(
  req: Request,
  res: Response
) {
  const statistics =
    await service.stats();

  return res.json(statistics);
}