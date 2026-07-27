"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRoles = findAllRoles;
exports.findRoleById = findRoleById;
exports.findRoleByName = findRoleByName;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
// server/src/modules/roles/role.repository.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
function findAllRoles() {
    return prisma_1.default.role.findMany({
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
function findRoleById(id) {
    return prisma_1.default.role.findUnique({
        where: { id },
        include: {
            rolePermissions: {
                include: { permission: true },
            },
            users: { select: { id: true } },
        },
    });
}
function findRoleByName(name) {
    return prisma_1.default.role.findUnique({
        where: { name },
    });
}
function createRole(data) {
    return prisma_1.default.role.create({
        data,
        include: {
            rolePermissions: {
                include: { permission: true },
            },
        },
    });
}
function updateRole(id, data) {
    return prisma_1.default.role.update({
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
function deleteRole(id) {
    return prisma_1.default.role.delete({
        where: { id },
    });
}
