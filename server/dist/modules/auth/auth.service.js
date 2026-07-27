"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const env_1 = require("../../config/env");
const AppError_1 = require("../../utils/AppError");
async function registerUser(data) {
    const existing = await prisma_1.default.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existing) {
        throw new AppError_1.AppError("Email already exists.", 409);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            employeeNumber: data.employeeNumber,
            email: data.email,
            password: hashedPassword,
            role: {
                connect: {
                    id: data.roleId,
                },
            },
        },
        include: {
            role: true,
        },
    });
    return {
        id: user.id,
        employeeNumber: user.employeeNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
    };
}
async function loginUser(data) {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: data.email,
        },
        include: {
            role: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    });
    if (!user) {
        throw new AppError_1.AppError("Invalid email or password", 401);
    }
    const passwordMatches = await bcrypt_1.default.compare(data.password, user.password);
    if (!passwordMatches) {
        throw new AppError_1.AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new AppError_1.AppError("This account has been disabled.", 403);
    }
    const signOptions = {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    };
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        roleId: user.roleId
    }, env_1.env.JWT_SECRET, signOptions);
    return {
        token,
        user: {
            id: user.id,
            employeeNumber: user.employeeNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
            permissions: user.role.rolePermissions.map((rp) => rp.permission.name),
        },
    };
}
