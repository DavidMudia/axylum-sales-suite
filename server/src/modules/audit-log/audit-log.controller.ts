import { Request, Response } from "express";

import * as service from "./audit-log.service";

/*
|--------------------------------------------------------------------------
| Create Audit Log
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
) {

  const auditLog =
    await service.create(req.body);

  return res.status(201).json({

    message:
      "Audit log created successfully.",

    auditLog,

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
    req.query.search as
      | string
      | undefined;

  const module =
    req.query.module as any;

  const userId =
    req.query.userId
      ? Number(req.query.userId)
      : undefined;

  const page =
    Number(req.query.page) || 1;

  const limit =
    Number(req.query.limit) || 20;

  const logs =
    await service.getAll(

      search,

      module,

      userId,

      page,

      limit

    );

  return res.json(logs);

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

  const auditLog =
    await service.getOne(
      Number(req.params.id)
    );

  return res.json(auditLog);

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