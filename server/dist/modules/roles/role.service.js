"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRoles = getAllRoles;
exports.getRoleById = getRoleById;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
// server/src/modules/roles/role.service.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./role.repository"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getAllRoles() {
    return repository.findAllRoles();
}
async function getRoleById(id) {
    const role = await repository.findRoleById(id);
    if (!role)
        throw new AppError_1.AppError("Role not found.", 404);
    return role;
}
async function createRole(data) {
    // 1. Verify admin password
    const admin = await prisma_1.default.user.findUnique({
        where: { id: data.currentUserId },
        select: { password: true },
    });
    if (!admin)
        throw new AppError_1.AppError("Admin user not found", 404);
    const isValid = await bcrypt_1.default.compare(data.adminPassword, admin.password);
    if (!isValid)
        throw new AppError_1.AppError("Invalid admin password", 401);
    // 2. Extract values without adminPassword and currentUserId
    const { adminPassword, currentUserId, ...roleData } = data;
    // 3. Check duplicate name
    const duplicate = await repository.findRoleByName(roleData.name);
    if (duplicate)
        throw new AppError_1.AppError("Role already exists.", 400);
    // 4. Create role
    return repository.createRole({
        name: roleData.name,
        displayName: roleData.displayName,
        description: roleData.description,
    });
}
async function updateRole(id, data) {
    // 1. Verify admin password
    const admin = await prisma_1.default.user.findUnique({
        where: { id: data.currentUserId },
        select: { password: true },
    });
    if (!admin)
        throw new AppError_1.AppError("Admin user not found", 404);
    const isValid = await bcrypt_1.default.compare(data.adminPassword, admin.password);
    if (!isValid)
        throw new AppError_1.AppError("Invalid admin password", 401);
    // 2. Extract values without adminPassword and currentUserId
    const { adminPassword, currentUserId, ...roleData } = data;
    // 3. Get existing role (to check if system)
    const role = await getRoleById(id);
    if (role.isSystem) {
        throw new AppError_1.AppError("System roles cannot be modified.", 400);
    }
    // 4. Update
    return repository.updateRole(id, {
        displayName: roleData.displayName,
        description: roleData.description,
    });
}
async function deleteRole(id, currentUserId, adminPassword) {
    // 1. Verify admin password
    const admin = await prisma_1.default.user.findUnique({
        where: { id: currentUserId },
        select: { password: true },
    });
    if (!admin)
        throw new AppError_1.AppError("Admin user not found", 404);
    const isValid = await bcrypt_1.default.compare(adminPassword, admin.password);
    if (!isValid)
        throw new AppError_1.AppError("Invalid admin password", 401);
    // 2. Get role
    const role = await getRoleById(id);
    if (role.isSystem) {
        throw new AppError_1.AppError("System roles cannot be deleted.", 400);
    }
    if (role.users && role.users.length > 0) {
        throw new AppError_1.AppError("Role is currently assigned to one or more users.", 400);
    }
    // 3. Delete
    return repository.deleteRole(id);
}
