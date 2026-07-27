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
exports.stats = stats;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./customer.repository"));
const document_number_service_1 = require("../document-number/document-number.service");
/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/
async function create(data) {
    const existing = await repository.findByName(data.name);
    if (existing) {
        throw new AppError_1.AppError("Customer already exists.", 400);
    }
    if (data.email) {
        const emailExists = await prisma_1.default.customer.findFirst({
            where: {
                email: data.email,
                isDeleted: false,
            },
        });
        if (emailExists) {
            throw new AppError_1.AppError("Email already exists.", 400);
        }
    }
    if (data.phone) {
        const phoneExists = await prisma_1.default.customer.findFirst({
            where: {
                phone: data.phone,
                isDeleted: false,
            },
        });
        if (phoneExists) {
            throw new AppError_1.AppError("Phone number already exists.", 400);
        }
    }
    const customerNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.CUSTOMER);
    return repository.create({
        ...data,
        customerNumber,
    });
}
/*
|--------------------------------------------------------------------------
| Get Customers
|--------------------------------------------------------------------------
*/
async function getAll(search, page = 1, limit = 20) {
    const customers = await repository.findAll(search, page, limit);
    const total = await repository.count(search);
    return {
        data: customers,
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
| Get Customer
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const customer = await repository.findById(id);
    if (!customer) {
        throw new AppError_1.AppError("Customer not found.", 404);
    }
    return customer;
}
/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    await getOne(id);
    return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Delete Customer
|--------------------------------------------------------------------------
*/
async function remove(id) {
    const customer = await getOne(id);
    if (customer.outstandingBalance.toNumber() > 0) {
        throw new AppError_1.AppError("Customer has an outstanding balance and cannot be deleted.", 400);
    }
    return repository.softDelete(id);
}
/*
|--------------------------------------------------------------------------
| Restore Customer
|--------------------------------------------------------------------------
*/
async function restore(id) {
    await getOne(id);
    return repository.restore(id);
}
/*
|--------------------------------------------------------------------------
| Customer Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
