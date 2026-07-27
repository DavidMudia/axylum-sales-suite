// server/src/modules/products/product.controller.ts
import { Request, Response } from "express";
import * as service from "./product.service";

export async function create(req: Request, res: Response): Promise<void> {
  const product = await service.create({
    ...req.body,
    createdById: req.user.id,
  });
  res.status(201).json(product);
}

export async function getAll(req: Request, res: Response): Promise<void> {
  const products = await service.getAll(
    req.query.search as string,
    req.query.page ? Number(req.query.page) : 1,
    req.query.limit ? Number(req.query.limit) : 20
  );
  res.json(products);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const product = await service.getOne(Number(req.params.id));
  res.json(product);
}

export async function update(req: Request, res: Response): Promise<void> {
  const product = await service.update(
    Number(req.params.id),
    {
      ...req.body,
      updatedById: req.user.id, // pass userId for password verification
    }
  );
  res.json(product);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await service.remove(Number(req.params.id));
  res.json({ message: "Product deleted successfully." });
}

export async function restore(req: Request, res: Response): Promise<void> {
  const product = await service.restore(Number(req.params.id));
  res.json(product);
}

export async function lowStock(req: Request, res: Response): Promise<void> {
  const products = await service.lowStock();
  res.json(products);
}