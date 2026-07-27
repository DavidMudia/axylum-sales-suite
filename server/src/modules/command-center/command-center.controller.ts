import { Response,Request } from "express";
import * as service from "./command-center.service";

export async function get(
  req: Request,
  res: Response
) {
  const dashboard =
    await service.getDashboard();

  res.json(dashboard);
}