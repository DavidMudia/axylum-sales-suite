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
exports.updateStatus = updateStatus;
exports.stats = stats;
exports.restore = restore;
exports.approve = approve;
exports.cancel = cancel;
exports.convertFromQuote = convertFromQuote;
// server/src/modules/orders/order.service.ts
const client_1 = require("@prisma/client");
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./order.repository"));
const document_number_service_1 = require("../document-number/document-number.service");
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function create(data, userId) {
    const customer = await prisma_1.default.customer.findFirst({
        where: { id: data.customerId, isDeleted: false },
    });
    if (!customer)
        throw new AppError_1.AppError("Customer not found.", 404);
    let subtotal = 0;
    const orderItems = [];
    for (const item of data.items) {
        const product = await prisma_1.default.product.findFirst({
            where: { id: item.productId, isDeleted: false },
        });
        if (!product)
            throw new AppError_1.AppError(`Product ${item.productId} not found.`, 404);
        if (item.quantity <= 0) {
            throw new AppError_1.AppError(`${product.name}: quantity must be greater than zero.`, 400);
        }
        const price = item.negotiatedPrice ?? Number(product.sellingPrice);
        const discount = item.discount ?? 0;
        const total = price * item.quantity - discount;
        subtotal += total;
        orderItems.push({
            quantity: item.quantity,
            unitPrice: Number(product.sellingPrice),
            negotiatedPrice: item.negotiatedPrice,
            total,
            product: { connect: { id: product.id } },
        });
    }
    // ✅ Include fees and discounts from the request
    const deliveryFee = data.deliveryFee ?? 0;
    const labourFee = data.labourFee ?? 0;
    const tax = data.tax ?? 0;
    const discount = data.discount ?? 0;
    const total = subtotal + deliveryFee + labourFee + tax - discount;
    const orderNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.SALES_ORDER);
    return prisma_1.default.$transaction(async () => {
        return repository.create({
            orderNumber,
            subtotal,
            deliveryFee,
            labourFee,
            tax,
            discount,
            total,
            notes: data.notes,
            quote: data.quoteId ? { connect: { id: data.quoteId } } : undefined,
            customer: { connect: { id: customer.id } },
            createdBy: { connect: { id: userId } },
            items: { create: orderItems },
        });
    });
}
async function getAll(search, status, customerId, page = 1, limit = 20) {
    const orders = await repository.getAll(search, status, customerId, page, limit);
    const total = await prisma_1.default.salesOrder.count({
        where: {
            isDeleted: false,
            ...(status && { status }),
            ...(customerId && { customerId }),
            ...(search && {
                OR: [
                    {
                        orderNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customer: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        customer: {
                            companyName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        },
    });
    return {
        data: orders,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
async function getOne(id) {
    const order = await repository.findById(id);
    if (!order)
        throw new AppError_1.AppError("Sales order not found.", 404);
    return order;
}
async function update(id, data) {
    await getOne(id);
    const { items, ...orderData } = data;
    return repository.update(id, orderData);
}
async function remove(id) {
    await getOne(id);
    return repository.deleteOrder(id);
}
async function updateStatus(id, status) {
    await getOne(id);
    return repository.updateStatus(id, status);
}
async function stats() {
    return repository.getStats();
}
async function restore(id) {
    const order = await repository.findDeletedById(id);
    if (!order)
        throw new AppError_1.AppError("Sales order not found.", 404);
    return repository.restore(id);
}
async function approve(id, userId) {
    await getOne(id);
    return repository.approve(id, userId);
}
async function cancel(id, userId, reason) {
    await getOne(id);
    return repository.cancel(id, userId, reason);
}
async function convertFromQuote(quoteId, userId) {
    const quote = await prisma_1.default.quote.findUnique({
        where: { id: quoteId, isDeleted: false },
        include: {
            customer: true,
            items: { include: { product: true } },
        },
    });
    if (!quote)
        throw new AppError_1.AppError("Quote not found.", 404);
    if (quote.status !== "ACCEPTED") {
        throw new AppError_1.AppError("Only accepted quotes can be converted to orders.", 400);
    }
    const orderNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.SALES_ORDER);
    const orderItems = quote.items.map((item) => ({
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        negotiatedPrice: item.negotiatedPrice ?? undefined,
        total: item.total,
        product: { connect: { id: item.productId } },
    }));
    // ✅ Fees default to 0 – user will edit them later in OrderDetails
    return repository.create({
        orderNumber,
        customer: { connect: { id: quote.customerId } },
        createdBy: { connect: { id: userId } },
        quote: { connect: { id: quoteId } },
        subtotal: quote.subtotal,
        discount: quote.discount,
        tax: 0,
        deliveryFee: 0,
        labourFee: 0,
        total: quote.total,
        notes: quote.notes,
        status: "PENDING",
        items: { create: orderItems },
    });
}
