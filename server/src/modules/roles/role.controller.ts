// server/src/modules/roles/role.controller.ts
import { Request, Response } from "express";
import * as service from "./role.service";

export async function getRoles(req: Request, res: Response) {
  const roles = await service.getAllRoles();
  res.json({ data: roles });
}

export async function createRole(req: Request, res: Response) {
  const role = await service.createRole({
    ...req.body,
    currentUserId: req.user.id,
  });
  res.status(201).json({ message: "Role created successfully.", role });
}

export async function updateRole(req: Request, res: Response) {
  const role = await service.updateRole(Number(req.params.id), {
    ...req.body,
    currentUserId: req.user.id,
  });
  res.json({ message: "Role updated successfully.", role });
}

export async function deleteRole(req: Request, res: Response) {
  await service.deleteRole(
    Number(req.params.id),
    req.user.id,
    req.body.adminPassword
  );
  res.json({ message: "Role deleted successfully." });
}