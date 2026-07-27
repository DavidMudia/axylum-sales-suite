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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.getAll = getAll;
exports.getOne = getOne;
exports.update = update;
exports.remove = remove;
exports.restore = restore;
exports.activate = activate;
exports.deactivate = deactivate;
exports.stats = stats;
exports.dashboard = dashboard;
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./warehouse.repository"));
/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/
async function create(data) {
    const existing = await repository.findByCode(data.code);
    if (existing) {
        throw new AppError_1.AppError("Warehouse code already exists.", 409);
    }
    return repository.create(data);
}
/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/
async function getAll(search, page = 1, limit = 20) {
    const warehouses = await repository.findAll(search, page, limit);
    const total = await repository.count(search);
    return {
        data: warehouses,
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
| Dashboard
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const warehouse = await repository.findById(id);
    if (!warehouse) {
        throw new AppError_1.AppError("Warehouse not found.", 404);
    }
    return warehouse;
}
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    await getOne(id);
    if (data.code) {
        const existing = await repository.findByCode(data.code);
        if (existing &&
            existing.id !== id) {
            throw new AppError_1.AppError("Warehouse code already exists.", 409);
        }
    }
    const updateData = {};
    if (data.name !== undefined)
        updateData.name = data.name;
    if (data.code !== undefined)
        updateData.code = data.code;
    if (data.address !== undefined)
        updateData.address =
            data.address;
    if (data.city !== undefined)
        updateData.city =
            data.city;
    if (data.state !== undefined)
        updateData.state =
            data.state;
    if (data.country !== undefined)
        updateData.country =
            data.country;
    if (data.phone !== undefined)
        updateData.phone =
            data.phone;
    if (data.managerName !== undefined)
        updateData.managerName =
            data.managerName;
    if (data.isPrimary !== undefined)
        updateData.isPrimary =
            data.isPrimary;
    return repository.update(id, updateData);
}
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/
async function remove(id) {
    const warehouse = await getOne(id);
    if (warehouse.inventories.length > 0) {
        throw new AppError_1.AppError("Warehouse cannot be deleted because inventory exists.", 400);
    }
    return repository.softDelete(id);
}
/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/
async function restore(id) {
    return repository.restore(id);
}
/*
|--------------------------------------------------------------------------
| Activate Warehouse
|--------------------------------------------------------------------------
*/
async function activate(id) {
    await getOne(id);
    return repository.activate(id);
}
/*
|--------------------------------------------------------------------------
| Deactivate Warehouse
|--------------------------------------------------------------------------
*/
async function deactivate(id) {
    await getOne(id);
    return repository.deactivate(id);
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
async function dashboard() {
    return repository.getDashboard();
}
