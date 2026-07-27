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
exports.approve = approve;
exports.reject = reject;
exports.stats = stats;
exports.convertToInvoice = convertToInvoice;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./quote.repository"));
const document_number_service_1 = require("../document-number/document-number.service");
const crypto_1 = __importDefault(require("crypto"));
async function create(data, userId) {
    const customer = await prisma_1.default.customer.findFirst({
        where: {
            id: data.customerId,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new AppError_1.AppError("Customer not found.", 404);
    }
    let subtotal = 0;
    const quoteItems = [];
    for (const item of data.items) {
        const product = await prisma_1.default.product.findFirst({
            where: {
                id: item.productId,
                isDeleted: false,
            },
        });
        if (!product) {
            throw new AppError_1.AppError(`Product ${item.productId} not found.`, 404);
        }
        if (item.quantity <= 0) {
            throw new AppError_1.AppError(`${product.name}: quantity must be greater than zero.`, 400);
        }
        const price = item.negotiatedPrice ??
            Number(product.sellingPrice);
        const discount = item.discount ?? 0;
        const lineTotal = price * item.quantity - discount;
        subtotal += lineTotal;
        quoteItems.push({
            quantity: item.quantity,
            unitPrice: Number(product.sellingPrice),
            negotiatedPrice: item.negotiatedPrice,
            discount,
            total: lineTotal,
            remarks: item.remarks,
            product: {
                connect: {
                    id: product.id,
                },
            },
        });
    }
    const tax = 0;
    const total = subtotal + tax;
    const quoteNumber = await (0, document_number_service_1.generateDocumentNumber)("QUOTE");
    const verificationCode = crypto_1.default.randomUUID();
    return prisma_1.default.$transaction(async () => {
        return repository.create({
            quoteNumber,
            verificationCode,
            subtotal,
            discount: 0,
            tax,
            total,
            notes: data.notes,
            validUntil: data.validUntil,
            customer: {
                connect: {
                    id: customer.id,
                },
            },
            createdBy: {
                connect: {
                    id: userId,
                },
            },
            items: {
                create: quoteItems,
            },
        });
    });
}
async function getAll(search, status, page = 1, limit = 20) {
    return repository.getAll(search, status, page, limit);
}
async function getOne(id) {
    const quote = await repository.findById(id);
    if (!quote) {
        throw new AppError_1.AppError("Quote not found.", 404);
    }
    return quote;
}
async function update(id, data) {
    await getOne(id);
    return repository.update(id, {
        notes: data.notes,
        validUntil: data.validUntil,
    });
}
async function remove(id) {
    await getOne(id);
    return repository.softDelete(id);
}
async function restore(id) {
    return repository.restore(id);
}
async function approve(id, userId) {
    await getOne(id);
    return repository.approve(id, userId);
}
async function reject(id, userId, note) {
    await getOne(id);
    return repository.reject(id, userId, note);
}
async function stats() {
    return repository.getStats();
}
async function convertToInvoice(quoteId, userId) {
    throw new AppError_1.AppError("Quote to Invoice conversion has not been implemented yet.", 501);
}
