import { Request, Response } from "express";

import * as service from "./goods-receipt.service";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {
  const receipt = await service.create(
    req.body,
    req.user!.id
  );
  const receiptId = receipt.id;

  return res.status(201).json({
    message: "Goods received successfully.",
    receipt,
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

  const warehouseId =
    req.query.warehouseId
      ? Number(req.query.warehouseId)
      : undefined;

  const supplierId =
    req.query.supplierId
      ? Number(req.query.supplierId)
      : undefined;

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) || 20;

  const receipts =
    await service.getAll(
      search,
      status,
      warehouseId,
      supplierId,
      page,
      limit
    );

  return res.json(receipts);
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
  const receipt =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(receipt);
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
  const receipt =
    await service.update(
      Number(req.params.id),
      req.body
    );

  return res.json({
    message:
      "Goods receipt updated successfully.",
    receipt,
  });
}

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

export async function verify(
  req: Request,
  res: Response
) {
  const receipt =
    await service.verify(
      Number(req.params.id),
      req.user!.id
    );

  return res.json({
    message:
      "Goods receipt verified successfully.",
    receipt,
  });
}

/*
|--------------------------------------------------------------------------
| Remove
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
      "Goods receipt deleted successfully.",
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
  const receipt =
    await service.restore(
      Number(req.params.id)
    );

  return res.json({
    message:
      "Goods receipt restored successfully.",
    receipt,
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
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function dashboard(
  req: Request,
  res: Response
) {
  const data =
    await service.dashboard();

  return res.json(data);
}