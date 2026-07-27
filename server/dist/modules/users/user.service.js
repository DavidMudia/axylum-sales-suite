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
exports.create = create;
exports.getAll = getAll;
exports.getOne = getOne;
exports.update = update;
exports.activate = activate;
exports.deactivate = deactivate;
exports.remove = remove;
exports.restore = restore;
exports.stats = stats;
exports.changePassword = changePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./user.repository"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/
async function create(data) {
    const existingEmail = await repository.findByEmail(data.email);
    if (existingEmail) {
        throw new AppError_1.AppError("Email already exists.", 409);
    }
    const existingEmployee = await repository.findByEmployeeNumber(data.employeeNumber);
    if (existingEmployee) {
        throw new AppError_1.AppError("Employee number already exists.", 409);
    }
    const role = await prisma_1.default.role.findUnique({
        where: {
            id: data.roleId,
        },
    });
    if (!role) {
        throw new AppError_1.AppError("Role not found.", 404);
    }
    const password = await bcrypt_1.default.hash(data.password, 12);
    const createData = {
        employeeNumber: data.employeeNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password,
        mustChangePassword: true,
        role: {
            connect: {
                id: data.roleId,
            },
        },
    };
    return repository.create(createData);
}
/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/
async function getAll(search, page = 1, limit = 20) {
    const users = await repository.findAll(search, page, limit);
    const total = await repository.count(search);
    return {
        data: users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
/*
|--------------------------------------------------------------------------
| Get One User
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const user = await repository.findById(id);
    if (!user) {
        throw new AppError_1.AppError("User not found.", 404);
    }
    return user;
}
/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    // 1. Verify admin password
    if (!data.adminPassword)
        throw new AppError_1.AppError("Admin password is required", 400);
    const currentUser = await prisma_1.default.user.findUnique({
        where: { id: data.currentUserId }, // we need to pass the logged-in user's id
        select: { password: true },
    });
    if (!currentUser)
        throw new AppError_1.AppError("User not found", 404);
    const isValid = await bcrypt_1.default.compare(data.adminPassword, currentUser.password);
    if (!isValid)
        throw new AppError_1.AppError("Invalid admin password", 401);
    // 2. Remove sensitive fields
    delete data.adminPassword;
    delete data.currentUserId;
    // 3. Update user
    return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Activate
|--------------------------------------------------------------------------
*/
async function activate(id) {
    await getOne(id);
    return repository.activate(id);
}
/*
|--------------------------------------------------------------------------
| Deactivate
|--------------------------------------------------------------------------
*/
async function deactivate(id) {
    await getOne(id);
    return repository.deactivate(id);
}
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/
async function remove(id) {
    await getOne(id);
    return repository.softDelete(id);
}
/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/
async function restore(id) {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user ||
        !user.deletedAt) {
        throw new AppError_1.AppError("User not found.", 404);
    }
    return repository.restore(id);
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
async function changePassword(userId, currentPassword, newPassword) {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new AppError_1.AppError("User not found.", 404);
    const isValid = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!isValid)
        throw new AppError_1.AppError("Current password is incorrect.", 401);
    const hashed = await bcrypt_1.default.hash(newPassword, 12);
    await prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashed, passwordChangedAt: new Date() },
    });
}
