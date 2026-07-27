// server/src/modules/roles/role.repository.ts
import prisma from "../../lib/prisma";
import { Prisma, RoleName } from "@prisma/client";

export function findAllRoles() {
  return prisma.role.findMany({
    include: {
      rolePermissions: {
        include: { permission: true },
      },
      users: {
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export function findRoleById(id: number) {
  return prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: {
        include: { permission: true },
      },
      users: { select: { id: true } },
    },
  });
}

export function findRoleByName(name: RoleName) {
  return prisma.role.findUnique({
    where: { name },
  });
}

export function createRole(data: {
  name: RoleName;
  displayName: string;
  description?: string;
}) {
  return prisma.role.create({
    data,
    include: {
      rolePermissions: {
        include: { permission: true },
      },
    },
  });
}

export function updateRole(id: number, data: Prisma.RoleUpdateInput) {
  return prisma.role.update({
    where: { id },
    data,
    include: {
      rolePermissions: {
        include: { permission: true },
      },
      users: { select: { id: true } },
    },
  });
}

export function deleteRole(id: number) {
  return prisma.role.delete({
    where: { id },
  });
}