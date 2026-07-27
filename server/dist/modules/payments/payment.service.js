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
exports.approve = approve;
exports.cancel = cancel;
exports.stats = stats;
// server/src/modules/payments/payment.service.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const repository = __importStar(require("./payment.repository"));
const client_1 = require("@prisma/client");
const document_number_service_1 = require("../document-number/document-number.service");
const crypto_1 = __importDefault(require("crypto"));
/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/
async function create(data, userId) {
    const invoice = await prisma_1.default.invoice.findFirst({
        where: { id: data.invoiceId, isDeleted: false },
    });
    if (!invoice)
        throw new AppError_1.AppError("Invoice not found.", 404);
    if (invoice.paymentStatus === client_1.InvoicePaymentStatus.PAID) {
        throw new AppError_1.AppError("Invoice has already been paid.", 400);
    }
    if (data.amount <= 0) {
        throw new AppError_1.AppError("Payment amount must be greater than zero.", 400);
    }
    if (data.amount > invoice.balance) {
        throw new AppError_1.AppError(`Payment exceeds outstanding balance of ₦${invoice.balance}.`, 400);
    }
    const paymentNumber = await (0, document_number_service_1.generateDocumentNumber)(client_1.DocumentType.PAYMENT);
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${Date.now()}`;
    const verificationCode = crypto_1.default.randomUUID();
    return prisma_1.default.$transaction(async (tx) => {
        return repository.create(tx, {
            paymentNumber,
            receiptNumber,
            verificationCode,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            notes: data.notes,
            status: client_1.PaymentStatus.PENDING,
            customer: { connect: { id: invoice.customerId } },
            invoice: { connect: { id: invoice.id } },
            createdBy: { connect: { id: userId } },
        });
    });
}
/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Get All Payments
|--------------------------------------------------------------------------
*/
async function getAll(search, status, method, customerId, refundable = false, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
        repository.getAll(search, status, method, customerId, refundable, page, limit),
        repository.count(search, status, method, customerId, refundable),
    ]);
    return {
        data,
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
| Get Single Payment
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    // ✅ Guard against invalid ID
    if (!id || isNaN(id)) {
        throw new AppError_1.AppError("Invalid payment ID", 400);
    }
    const payment = await repository.findById(id);
    if (!payment)
        throw new AppError_1.AppError("Payment not found.", 404);
    return payment;
}
/*
|--------------------------------------------------------------------------
| Update Payment
|--------------------------------------------------------------------------
*/
async function update(id, data) {
    const payment = await getOne(id);
    if (payment.status === client_1.PaymentStatus.COMPLETED) {
        throw new AppError_1.AppError("Completed payments cannot be modified.", 400);
    }
    if (payment.status === client_1.PaymentStatus.CANCELLED) {
        throw new AppError_1.AppError("Cancelled payments cannot be modified.", 400);
    }
    return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Approve Payment
|--------------------------------------------------------------------------
*/
async function approve(id, userId) {
    const payment = await getOne(id);
    if (payment.status === client_1.PaymentStatus.COMPLETED) {
        throw new AppError_1.AppError("Payment has already been approved.", 400);
    }
    if (payment.status === client_1.PaymentStatus.CANCELLED) {
        throw new AppError_1.AppError("Cancelled payments cannot be approved.", 400);
    }
    return prisma_1.default.$transaction(async (tx) => {
        const invoice = await tx.invoice.findUnique({
            where: { id: payment.invoiceId },
        });
        if (!invoice)
            throw new AppError_1.AppError("Invoice not found.", 404);
        const amountPaid = invoice.amountPaid + payment.amount;
        const balance = invoice.total - amountPaid;
        let paymentStatus = client_1.InvoicePaymentStatus.PARTIAL;
        let invoiceStatus = client_1.InvoiceStatus.PARTIAL;
        if (balance <= 0) {
            paymentStatus = client_1.InvoicePaymentStatus.PAID;
            invoiceStatus = client_1.InvoiceStatus.PAID;
        }
        await tx.invoice.update({
            where: { id: invoice.id },
            data: {
                amountPaid,
                balance,
                paymentStatus,
                status: invoiceStatus,
            },
        });
        return tx.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.COMPLETED,
                approvedAt: new Date(),
                approvedBy: { connect: { id: userId } },
            },
            include: { invoice: true, customer: true },
        });
    });
}
/*
|--------------------------------------------------------------------------
| Cancel Payment
|--------------------------------------------------------------------------
*/
async function cancel(id, userId, reason) {
    const payment = await getOne(id);
    if (payment.status === client_1.PaymentStatus.CANCELLED) {
        throw new AppError_1.AppError("Payment is already cancelled.", 400);
    }
    if (payment.status === client_1.PaymentStatus.COMPLETED) {
        throw new AppError_1.AppError("Completed payments cannot be cancelled. Issue a refund instead.", 400);
    }
    return prisma_1.default.payment.update({
        where: { id },
        data: {
            status: client_1.PaymentStatus.CANCELLED,
            cancelledAt: new Date(),
            cancellationReason: reason,
            cancelledBy: { connect: { id: userId } },
        },
        include: { invoice: true, customer: true },
    });
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
