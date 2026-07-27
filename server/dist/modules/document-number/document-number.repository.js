"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSequence = findSequence;
exports.createSequence = createSequence;
exports.incrementSequence = incrementSequence;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/*
|--------------------------------------------------------------------------
| Find Sequence
|--------------------------------------------------------------------------
*/
async function findSequence(type, year) {
    return prisma.documentSequence.findUnique({
        where: {
            type_year: {
                type,
                year,
            },
        },
    });
}
/*
|--------------------------------------------------------------------------
| Create Sequence
|--------------------------------------------------------------------------
*/
async function createSequence(type, year) {
    return prisma.documentSequence.create({
        data: {
            type,
            year,
            currentNumber: 1,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Increment Sequence
|--------------------------------------------------------------------------
*/
async function incrementSequence(id) {
    return prisma.documentSequence.update({
        where: {
            id,
        },
        data: {
            currentNumber: {
                increment: 1,
            },
        },
    });
}
