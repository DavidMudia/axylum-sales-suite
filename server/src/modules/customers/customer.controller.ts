import { Request, Response } from "express";

import * as service from "./customer.service";

/*
|--------------------------------------------------------------------------
| Statistics
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

/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/

export async function create(
  req: Request,
  res: Response
): Promise<void> {
  const customer =
    await service.create({
      ...req.body,

      createdBy: {
        connect: {
          id: req.user!.id,
        },
      },
    });

  res.status(201).json(customer);
}

/*
|--------------------------------------------------------------------------
| Get All Customers
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

  const customers =
    await service.getAll(
      search,
      page,
      limit
    );

  res.json(customers);
}

/*
|--------------------------------------------------------------------------
| Get Single Customer
|--------------------------------------------------------------------------
*/

export async function getOne(
  req: Request,
  res: Response
): Promise<void> {

  const customer =
    await service.getOne(
      Number(req.params.id)
    );

  res.json(customer);
}

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

export async function update(
  req: Request,
  res: Response
): Promise<void> {

  const customer =
    await service.update(
      Number(req.params.id),
      req.body
    );

  res.json(customer);
}

/*
|--------------------------------------------------------------------------
| Delete Customer
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
      "Customer deleted successfully.",
  });

}

/*
|--------------------------------------------------------------------------
| Restore Customer
|--------------------------------------------------------------------------
*/

export async function restore(
  req: Request,
  res: Response
): Promise<void> {

  const customer =
    await service.restore(
      Number(req.params.id)
    );

  res.json(customer);

}