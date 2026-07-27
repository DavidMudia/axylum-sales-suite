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
exports.remove = remove;
exports.restore = restore;
exports.lowStock = lowStock;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./product.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/
async function create(data) {
    // 1. Verify password
    if (!data.createdById)
        throw new AppError_1.AppError("User ID missing", 400);
    const user = await prisma_1.default.user.findUnique({
        where: { id: Number(data.createdById) },
        select: { password: true },
    });
    if (!user)
        throw new AppError_1.AppError("User not found", 404);
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid)
        throw new AppError_1.AppError("Invalid password", 401);
    // 2. Check duplicate name
    const existing = await repository.findByName(data.name);
    if (existing)
        throw new AppError_1.AppError("Product already exists.", 400);
    // 3. Prepare product data
    const productData = {
        name: data.name,
        description: data.description,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        currentStock: data.currentStock ?? 0,
        minimumStock: data.minimumStock ?? 0,
        reorderLevel: data.reorderLevel ?? 0,
        productNumber: `PRD-${Date.now()}`,
        unit: data.unit,
        createdBy: { connect: { id: Number(data.createdById) } },
    };
    return repository.create(productData);
}
/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/
async function getAll(search, page = 1, limit = 20) {
    const products = await repository.findAll(search, page, limit);
    const total = await repository.count(search);
    return {
        data: products,
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
| Get Product
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const product = await repository.findById(id);
    if (!product)
        throw new AppError_1.AppError("Product not found.", 404);
    return product;
}
/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    // 1. Verify password
    if (!data.updatedById)
        throw new AppError_1.AppError("User ID missing", 400);
    const user = await prisma_1.default.user.findUnique({
        where: { id: Number(data.updatedById) },
        select: { password: true },
    });
    if (!user)
        throw new AppError_1.AppError("User not found", 404);
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid)
        throw new AppError_1.AppError("Invalid password", 401);
    // 2. Remove sensitive fields that should not go to Prisma
    delete data.password;
    delete data.updatedById;
    // 3. Update product
    return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/
async function remove(id) {
    await getOne(id);
    return repository.softDelete(id);
}
/*
|--------------------------------------------------------------------------
| Restore Product
|--------------------------------------------------------------------------
*/
async function restore(id) {
    await getOne(id);
    return repository.restore(id);
}
/*
|--------------------------------------------------------------------------
| Low Stock
|--------------------------------------------------------------------------
*/
async function lowStock() {
    return repository.getLowStockProducts();
}
