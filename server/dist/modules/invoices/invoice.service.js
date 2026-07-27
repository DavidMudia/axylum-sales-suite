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
exports.convertFromSalesOrder = convertFromSalesOrder;
exports.getAll = getAll;
exports.getOne = getOne;
exports.update = update;
exports.approve = approve;
exports.markPrinted = markPrinted;
exports.remove = remove;
exports.restore = restore;
exports.stats = stats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./invoice.repository"));
const client_1 = require("@prisma/client");
const document_number_service_1 = require("../document-number/document-number.service");
/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
*/
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
    const invoiceItems = [];
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
        const price = item.unitPrice;
        const lineTotal = price * item.quantity;
        subtotal += lineTotal;
        invoiceItems.push({
            quantity: item.quantity,
            unitPrice: price,
            total: lineTotal,
            product: {
                connect: {
                    id: product.id,
                },
            },
        });
    }
    const deliveryFee = data.deliveryFee ?? 0;
    const labourFee = data.labourFee ?? 0;
    const tax = data.tax ?? 0;
    const discount = data.discount ?? 0;
    const total = subtotal +
        deliveryFee +
        labourFee +
        tax -
        discount;
    const invoiceNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.INVOICE);
    const verificationCode = crypto_1.default.randomUUID();
    return repository.create({
        invoiceNumber,
        verificationCode,
        deliveryFee,
        labourFee,
        subtotal,
        discount,
        tax,
        total,
        balance: total,
        paymentStatus: "UNPAID",
        status: client_1.InvoiceStatus.UNPAID,
        dueDate: data.dueDate,
        notes: data.notes,
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
            create: invoiceItems,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Convert Sales Order → Invoice
|--------------------------------------------------------------------------
*/
async function convertFromSalesOrder(salesOrderId, userId) {
    const order = await prisma_1.default.salesOrder.findFirst({
        where: {
            id: salesOrderId,
            isDeleted: false,
        },
        include: {
            customer: true,
            items: true,
        },
    });
    if (!order) {
        throw new AppError_1.AppError("Sales order not found.", 404);
    }
    const existing = await prisma_1.default.invoice.findFirst({
        where: {
            salesOrderId,
            isDeleted: false,
        },
    });
    if (existing) {
        throw new AppError_1.AppError("Invoice already exists for this sales order.", 409);
    }
    const invoiceNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.INVOICE);
    const verificationCode = crypto_1.default.randomUUID();
    const items = [];
    for (const item of order.items) {
        const sellingPrice = item.negotiatedPrice ??
            item.unitPrice;
        items.push({
            quantity: item.quantity,
            unitPrice: sellingPrice,
            total: item.total,
            product: {
                connect: {
                    id: item.productId,
                },
            },
        });
    }
    return repository.create({
        invoiceNumber,
        verificationCode,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        labourFee: order.labourFee,
        discount: order.discount,
        tax: order.tax,
        total: order.total,
        balance: order.total,
        paymentStatus: "UNPAID",
        status: client_1.InvoiceStatus.UNPAID,
        notes: order.notes,
        customer: {
            connect: {
                id: order.customerId,
            },
        },
        salesOrder: {
            connect: {
                id: order.id,
            },
        },
        createdBy: {
            connect: {
                id: userId,
            },
        },
        items: {
            create: items,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Get All Invoices
|--------------------------------------------------------------------------
*/
async function getAll(search, status, page = 1, limit = 20) {
    return repository.getAll(search, status, page, limit);
}
/*
|--------------------------------------------------------------------------
| Get Single Invoice
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const invoice = await repository.findById(id);
    if (!invoice) {
        throw new AppError_1.AppError("Invoice not found.", 404);
    }
    return invoice;
}
/*
|--------------------------------------------------------------------------
| Update Invoice
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    const invoice = await getOne(id);
    if (invoice.status === "PAID") {
        throw new AppError_1.AppError("Paid invoices cannot be modified.", 400);
    }
    if (invoice.isPrinted) {
        throw new AppError_1.AppError("Printed invoices cannot be modified.", 400);
    }
    return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Approve Invoice
|--------------------------------------------------------------------------
*/
async function approve(id, userId, note) {
    await getOne(id);
    return repository.approve(id, userId, note);
}
/*
|--------------------------------------------------------------------------
| Mark Invoice as Printed
|--------------------------------------------------------------------------
*/
async function markPrinted(id) {
    const invoice = await getOne(id);
    if (invoice.isPrinted) {
        throw new AppError_1.AppError("Invoice has already been printed.", 400);
    }
    return repository.markPrinted(id);
}
/*
|--------------------------------------------------------------------------
| Soft Delete Invoice
|--------------------------------------------------------------------------
*/
async function remove(id) {
    const invoice = await getOne(id);
    if (invoice.status === "PAID") {
        throw new AppError_1.AppError("Paid invoices cannot be deleted.", 400);
    }
    return repository.softDelete(id);
}
/*
|--------------------------------------------------------------------------
| Restore Invoice
|--------------------------------------------------------------------------
*/
async function restore(id) {
    const invoice = await prisma_1.default.invoice.findFirst({
        where: {
            id,
            isDeleted: true,
        },
    });
    if (!invoice) {
        throw new AppError_1.AppError("Invoice not found.", 404);
    }
    return repository.restore(id);
}
/*
|--------------------------------------------------------------------------
| Invoice Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
