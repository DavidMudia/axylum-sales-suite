import { Request, Response } from "express";

import * as service from "./warehouse.service";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {
  const warehouse =
    await service.create(req.body);

  return res.status(201).json({
    message:
      "Warehouse created successfully.",
    warehouse,
  });
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/


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

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) || 20;

  const warehouses =
    await service.getAll(
      search,
      page,
      limit
    );

  return res.json(warehouses);
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
  const warehouse =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(warehouse);
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
  const warehouse =
    await service.update(
      Number(req.params.id),
      req.body
    );

  return res.json({
    message:
      "Warehouse updated successfully.",
    warehouse,
  });
}

/*
|--------------------------------------------------------------------------
| Activate
|--------------------------------------------------------------------------
*/

export async function activate(
  req: Request,
  res: Response
) {
  const warehouse =
    await service.activate(
      Number(req.params.id)
    );

  return res.json({
    message:
      "Warehouse activated successfully.",
    warehouse,
  });
}

/*
|--------------------------------------------------------------------------
| Deactivate
|--------------------------------------------------------------------------
*/

export async function deactivate(
  req: Request,
  res: Response
) {
  const warehouse =
    await service.deactivate(
      Number(req.params.id)
    );

  return res.json({
    message:
      "Warehouse deactivated successfully.",
    warehouse,
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
      "Warehouse deleted successfully.",
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
  const warehouse =
    await service.restore(
      Number(req.params.id)
    );

  return res.json({
    message:
      "Warehouse restored successfully.",
    warehouse,
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
  const dashboard =
    await service.dashboard();

  return res.json(dashboard);
}