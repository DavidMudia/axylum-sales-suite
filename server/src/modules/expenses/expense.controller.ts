import { Request, Response } from "express";
import * as service from "./expense.service";

export async function create(req: Request, res: Response) {
  const expense = await service.create(req.body);
  res.status(201).json(expense);
}

export async function getAll(req: Request, res: Response) {
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await service.getAll(search, category, startDate, endDate, page, limit);
  res.json(result);
}

export async function getOne(req: Request, res: Response) {
  const expense = await service.getOne(Number(req.params.id));
  res.json(expense);
}

export async function update(req: Request, res: Response) {
  const expense = await service.update(Number(req.params.id), req.body);
  res.json(expense);
}

export async function remove(req: Request, res: Response) {
  await service.remove(Number(req.params.id));
  res.json({ message: "Expense deleted." });
}

export async function stats(req: Request, res: Response) {
  const stats = await service.getStats();
  res.json(stats);
}