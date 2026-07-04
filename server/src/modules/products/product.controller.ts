import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";

import * as service from "./product.service";

export async function create(
  req: AuthRequest,
  res: Response
) {
  const product = await service.create(
    req.body,
    req.user!.id
  );

  res.status(201).json(product);
}

export async function getAll(
  req: Request,
  res: Response
) {
  const search =
    req.query.search as string;

  const page =
    Number(req.query.page) || 1;

  const products =
    await service.getAll(
      search,
      page
    );

  res.json(products);
}

export async function getOne(
  req: Request,
  res: Response
) {
  const product =
    await service.getOne(
      Number(req.params.id)
    );

  res.json(product);
}

export async function update(
  req: Request,
  res: Response
) {
  const product =
    await service.update(
      Number(req.params.id),
      req.body
    );

  res.json(product);
}

export async function remove(
  req: Request,
  res: Response
) {
  await service.remove(
    Number(req.params.id)
  );

  res.json({
    message: "Deleted",
  });
}

export async function stats(
  req: Request,
  res: Response
) {
  res.json(await service.stats());
}