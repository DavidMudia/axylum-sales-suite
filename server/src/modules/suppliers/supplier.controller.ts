import { Request, Response } from "express";

import * as service from "./supplier.service";

/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  const supplier =
    await service.create({
      ...req.body,

      createdBy: {
        connect: {
          id: req.user!.id,
        },
      },
    });

  res.status(201).json(supplier);
}

/*
|--------------------------------------------------------------------------
| Get All Suppliers
|--------------------------------------------------------------------------
*/

export async function getAll(
  req: Request,
  res: Response
): Promise<void> {

  const search =
    req.query.search as string | undefined;

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) || 20;

  const suppliers =
    await service.getAll(
      search,
      page,
      limit
    );

  res.json(suppliers);
}

/*
|--------------------------------------------------------------------------
| Get Single Supplier
|--------------------------------------------------------------------------
*/

export async function getOne(
  req: Request,
  res: Response
): Promise<void> {

  const supplier =
    await service.getOne(
      Number(req.params.id)
    );

  res.json(supplier);
}

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

export async function update(
  req: Request,
  res: Response
): Promise<void> {

  const supplier =
    await service.update(
      Number(req.params.id),
      req.body
    );

  res.json(supplier);
}

/*
|--------------------------------------------------------------------------
| Delete Supplier
|--------------------------------------------------------------------------
*/

export async function remove(
  req: Request,
  res: Response
): Promise<void> {

  await service.remove(
    Number(req.params.id)
  );

  res.json({
    message:
      "Supplier deleted successfully.",
  });
}

/*
|--------------------------------------------------------------------------
| Restore Supplier
|--------------------------------------------------------------------------
*/

export async function restore(
  req: Request,
  res: Response
): Promise<void> {

  const supplier =
    await service.restore(
      Number(req.params.id)
    );

  res.json({
    message:
      "Supplier restored successfully.",

    supplier,
  });
}

/*
|--------------------------------------------------------------------------
| Supplier Statistics
|--------------------------------------------------------------------------
*/

export async function stats(
  req: Request,
  res: Response
): Promise<void> {

  const statistics =
    await service.stats();

  res.json(statistics);
}
// server/src/modules/suppliers/supplier.controller.ts
export async function getStats(req: Request, res: Response): Promise<void> {
  const stats = await service.getStats(Number(req.params.id));
  res.json(stats);
}