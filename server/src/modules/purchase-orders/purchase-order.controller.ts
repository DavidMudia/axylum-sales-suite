import { Request, Response } from "express";
import * as service from "./purchase-order.service";

export async function create(req: Request, res: Response) {
  const purchaseOrder = await service.create(req.body, req.user!.id);
  return res.status(201).json({
    message: "Purchase Order created successfully.",
    purchaseOrder,
  });
}

export async function getAll(req: Request, res: Response) {
  const search = req.query.search as string | undefined;
  const status = req.query.status as any;
  const supplierId = req.query.supplierId ? Number(req.query.supplierId) : undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const purchaseOrders = await service.getAll(search, status, supplierId, page, limit);
  return res.json(purchaseOrders);
}

export async function getOne(req: Request, res: Response) {
  const purchaseOrder = await service.getOne(Number(req.params.id));
  return res.json(purchaseOrder);
}

export async function update(req: Request, res: Response) {
  const purchaseOrder = await service.update(Number(req.params.id), req.body);
  return res.json({
    message: "Purchase Order updated successfully.",
    purchaseOrder,
  });
}

export async function remove(req: Request, res: Response) {
  await service.remove(Number(req.params.id));
  return res.json({ message: "Purchase Order deleted successfully." });
}

export async function restore(req: Request, res: Response) {
  const purchaseOrder = await service.restore(Number(req.params.id));
  return res.json({
    message: "Purchase Order restored successfully.",
    purchaseOrder,
  });
}

export async function approve(req: Request, res: Response) {
  const purchaseOrder = await service.approve(Number(req.params.id), req.user!.id);
  return res.json({
    message: "Purchase Order approved successfully.",
    purchaseOrder,
  });
}

export async function cancel(req: Request, res: Response) {
  const purchaseOrder = await service.cancel(
    Number(req.params.id),
    req.user!.id,
    req.body.reason
  );
  return res.json({
    message: "Purchase Order cancelled successfully.",
    purchaseOrder,
  });
}

export async function stats(req: Request, res: Response) {
  const statistics = await service.stats();
  return res.json(statistics);
}