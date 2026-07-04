import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";

import {
  create as createCustomer,
  getAll as getCustomers,
  getCustomerById,
  updateCustomer,
  softDeleteCustomer,
  getCustomerStats,
} from "./customer.service";

export async function create(req: AuthRequest, res: Response) {
  const customer = await createCustomer(
    req.body,
    req.user!.id
  );

  return res.status(201).json({
    message: "Customer created successfully",
    customer,
  });
}

export async function getAll(req: Request, res: Response) {
  const search = req.query.search as string | undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const customers = await getCustomers(search, page, limit);

  return res.status(200).json(customers);
}

export async function getOne(req: Request, res: Response) {
  const customer = await getCustomerById(Number(req.params.id));

  if (!customer) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  return res.json(customer);
}

export async function update(req: Request, res: Response) {
  const customer = await updateCustomer(
    Number(req.params.id),
    req.body
  );

  return res.json(customer);
}

export async function remove(req: Request, res: Response) {
  await softDeleteCustomer(Number(req.params.id));

  return res.json({
    message: "Customer deleted",
  });
}

export async function stats(req: Request, res: Response) {
  const data = await getCustomerStats();

  return res.json(data);
}