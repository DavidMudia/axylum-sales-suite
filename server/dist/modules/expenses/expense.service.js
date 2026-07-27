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
exports.getStats = getStats;
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./expense.repository"));
async function create(data) {
    return repository.create({
        description: data.description,
        category: data.category,
        amount: data.amount,
        date: data.date,
        reference: data.reference,
    });
}
async function getAll(search, category, startDate, endDate, page = 1, limit = 20) {
    const expenses = await repository.findAll(search, category, startDate, endDate, page, limit);
    const total = await repository.count(search, category, startDate, endDate);
    return {
        data: expenses,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
async function getOne(id) {
    const expense = await repository.findById(id);
    if (!expense)
        throw new AppError_1.AppError("Expense not found.", 404);
    return expense;
}
async function update(id, data) {
    await getOne(id);
    return repository.update(id, data);
}
async function remove(id) {
    await getOne(id);
    return repository.remove(id);
}
async function getStats() {
    const total = await repository.getStats();
    const categoryStats = await repository.getCategoryStats();
    return {
        totalAmount: total._sum.amount || 0,
        totalCount: total._count,
        categoryStats,
    };
}
