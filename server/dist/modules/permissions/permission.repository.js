"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findByName = findByName;
exports.create = create;
exports.remove = remove;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/
function findAll() {
    return prisma_1.default.permission.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/
function findById(id) {
    return prisma_1.default.permission.findUnique({
        where: {
            id,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/
function findByName(name) {
    return prisma_1.default.permission.findUnique({
        where: {
            name,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
function create(data) {
    return prisma_1.default.permission.create({
        data,
    });
}
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/
function remove(id) {
    return prisma_1.default.permission.delete({
        where: {
            id,
        },
    });
}
