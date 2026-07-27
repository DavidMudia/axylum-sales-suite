// server/src/modules/roles/role.service.ts
import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError";
import { RoleName } from "@prisma/client";
import * as repository from "./role.repository";
import prisma from "../../lib/prisma";
import { CreateRoleInput, UpdateRoleInput } from "./role.schema";

export async function getAllRoles() {
  return repository.findAllRoles();
}

export async function getRoleById(id: number) {
  const role = await repository.findRoleById(id);
  if (!role) throw new AppError("Role not found.", 404);
  return role;
}

export async function createRole(data: CreateRoleInput & { currentUserId: number }) {
  // 1. Verify admin password
  const admin = await prisma.user.findUnique({
    where: { id: data.currentUserId },
    select: { password: true },
  });
  if (!admin) throw new AppError("Admin user not found", 404);
  const isValid = await bcrypt.compare(data.adminPassword, admin.password);
  if (!isValid) throw new AppError("Invalid admin password", 401);

  // 2. Extract values without adminPassword and currentUserId
  const { adminPassword, currentUserId, ...roleData } = data;

  // 3. Check duplicate name
  const duplicate = await repository.findRoleByName(roleData.name as RoleName);
  if (duplicate) throw new AppError("Role already exists.", 400);

  // 4. Create role
  return repository.createRole({
    name: roleData.name as RoleName,
    displayName: roleData.displayName,
    description: roleData.description,
  });
}

export async function updateRole(id: number, data: UpdateRoleInput & { currentUserId: number }) {
  // 1. Verify admin password
  const admin = await prisma.user.findUnique({
    where: { id: data.currentUserId },
    select: { password: true },
  });
  if (!admin) throw new AppError("Admin user not found", 404);
  const isValid = await bcrypt.compare(data.adminPassword, admin.password);
  if (!isValid) throw new AppError("Invalid admin password", 401);

  // 2. Extract values without adminPassword and currentUserId
  const { adminPassword, currentUserId, ...roleData } = data;

  // 3. Get existing role (to check if system)
  const role = await getRoleById(id);
  if (role.isSystem) {
    throw new AppError("System roles cannot be modified.", 400);
  }

  // 4. Update
  return repository.updateRole(id, {
    displayName: roleData.displayName,
    description: roleData.description,
  });
}

export async function deleteRole(id: number, currentUserId: number, adminPassword: string) {
  // 1. Verify admin password
  const admin = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { password: true },
  });
  if (!admin) throw new AppError("Admin user not found", 404);
  const isValid = await bcrypt.compare(adminPassword, admin.password);
  if (!isValid) throw new AppError("Invalid admin password", 401);

  // 2. Get role
  const role = await getRoleById(id);
  if (role.isSystem) {
    throw new AppError("System roles cannot be deleted.", 400);
  }
  if (role.users && role.users.length > 0) {
    throw new AppError("Role is currently assigned to one or more users.", 400);
  }

  // 3. Delete
  return repository.deleteRole(id);
}