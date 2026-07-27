import { Request, Response } from "express";
import { InventoryReferenceType } from "@prisma/client";
import * as service from "./inventory.service";


export async function getAll(
  req: Request,
  res: Response
) {
  const search =
    req.query.search as string | undefined;

  const warehouseId = req.query.warehouseId
    ? Number(req.query.warehouseId)
    : undefined;

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) || 20;

  const inventory =
  await service.getAll(
    search,
    page,
    limit
  );

  return res.json(inventory);
}

export async function getOne(
  req: Request,
  res: Response
) {
  const inventory =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(inventory);
}

export async function reserve(
  req: Request,
  res: Response
) {
  await service.reserveStock(
  Number(req.params.id),
  req.body.quantity,
  req.user!.id,
  InventoryReferenceType.SALES_ORDER,
  req.body.referenceId
);

  return res.json({
    message: "Stock reserved successfully.",
  });
}

export async function release(
  req: Request,
  res: Response
) {
  await service.releaseStock(
  Number(req.params.id),
  req.body.quantity,
  req.user!.id,
  InventoryReferenceType.SALES_ORDER,
  req.body.referenceId
);

  return res.json({
    message: "Reserved stock released.",
  });
}

export async function adjust(
  req: Request,
  res: Response
) {
  const inventory =
    await service.adjust(
      Number(req.params.id),
      req.body,
      req.user!.id
    );

  return res.json({
    message: "Inventory adjusted successfully.",
    inventory,
  });
}

export async function transfer(
  req: Request,
  res: Response
) {
  const inventory =
    await service.transfer(
      req.body,
      req.user!.id
    );

  return res.json({
    message: "Inventory transferred successfully.",
    inventory,
  });
}

export async function lowStock(
  req: Request,
  res: Response
) {
  const items =
    await service.lowStock();

  return res.json(items);
}

export async function outOfStock(
  req: Request,
  res: Response
) {
  const items =
    await service.outOfStock();

  return res.json(items);
}
/*
|--------------------------------------------------------------------------
| Inventory Movement History
|--------------------------------------------------------------------------
*/

export async function history(
  req: Request,
  res: Response
) {
  const history =
    await service.history(
      Number(req.params.id)
    );

  return res.json(history);
}

export async function stats(
  req: Request,
  res: Response
) {
  const stats =
    await service.stats();

  return res.json(stats);
}