import { Request, Response } from "express";

import * as service from "./dashboard.service";

export async function getDashboard(
  req: Request,
  res: Response
) {
  const dashboard =
    await service.getDashboard();

  return res.json(dashboard);
}