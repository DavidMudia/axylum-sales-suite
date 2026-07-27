"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findAll = findAll;
exports.count = count;
exports.findById = findById;
exports.update = update;
exports.remove = remove;
exports.getStats = getStats;
exports.getCategoryStats = getCategoryStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
function create(data) {
    return prisma_1.default.expense.create({ data });
}
function findAll(search, category, startDate, endDate, page = 1, limit = 20) {
    return prisma_1.default.expense.findMany({
        where: {
            ...(category && { category: category }),
            ...(startDate && { date: { gte: startDate } }),
            ...(endDate && { date: { lte: endDate } }),
            ...(search && {
                OR: [
                    { description: { contains: search, mode: "insensitive" } },
                    { reference: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
}
function count(search, category, startDate, endDate) {
    return prisma_1.default.expense.count({
        where: {
            ...(category && { category: category }),
            ...(startDate && { date: { gte: startDate } }),
            ...(endDate && { date: { lte: endDate } }),
            ...(search && {
                OR: [
                    { description: { contains: search, mode: "insensitive" } },
                    { reference: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
    });
}
function findById(id) {
    return prisma_1.default.expense.findUnique({ where: { id } });
}
function update(id, data) {
    return prisma_1.default.expense.update({ where: { id }, data });
}
function remove(id) {
    return prisma_1.default.expense.delete({ where: { id } });
}
function getStats() {
    return prisma_1.default.expense.aggregate({
        _sum: { amount: true },
        _count: true,
    });
}
function getCategoryStats() {
    return prisma_1.default.expense.groupBy({
        by: ['category'],
        _sum: { amount: true },
        _count: { amount: true },
    });
}
