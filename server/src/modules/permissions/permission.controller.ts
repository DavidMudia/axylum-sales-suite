import { Request, Response } from "express";

import * as service from "./permission.service";

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export async function getAll(
  req: Request,
  res: Response
) {
  const permissions =
    await service.getAll();

  res.json(permissions);
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {
  const permission =
    await service.create(

      req.body.name,

      req.body.module,

      req.body.action,

      req.body.description

    );

  res.status(201).json(permission);
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

  res.json({
    message:
      "Permission deleted successfully.",
  });
}