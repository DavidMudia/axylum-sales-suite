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
exports.approve = approve;
exports.reject = reject;
exports.stats = stats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = require("../../utils/AppError");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const repository = __importStar(require("./refund.repository"));
const client_1 = require("@prisma/client");
const document_number_service_1 = require("../document-number/document-number.service");
const client_2 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/
async function create(data, userId) {
    const payment = await prisma_1.default.payment.findUnique({
        where: {
            id: data.paymentId,
        },
        include: {
            invoice: true,
            customer: true,
        },
    });
    if (!payment) {
        throw new AppError_1.AppError("Payment not found.", 404);
    }
    if (payment.status !==
        client_1.PaymentStatus.COMPLETED) {
        throw new AppError_1.AppError("Only completed payments can be refunded.", 400);
    }
    const remaining = payment.amount -
        payment.refundedAmount;
    if (data.amount > remaining) {
        throw new AppError_1.AppError("Refund amount exceeds remaining refundable balance.", 400);
    }
    const refundNumber = await (0, document_number_service_1.generateDocumentNumber)(client_2.DocumentType.REFUND);
    return prisma_1.default.$transaction(async (tx) => {
        const refund = await repository.create(tx, {
            refundNumber,
            verificationCode: crypto_1.default.randomUUID(),
            amount: data.amount,
            reason: data.reason,
            notes: data.notes,
            refundMethod: data.refundMethod,
            status: client_1.RefundStatus.PENDING,
            payment: {
                connect: {
                    id: payment.id,
                },
            },
            invoice: {
                connect: {
                    id: payment.invoiceId,
                },
            },
            customer: {
                connect: {
                    id: payment.customerId,
                },
            },
            processedBy: {
                connect: {
                    id: userId,
                },
            },
        });
        await (0, audit_log_service_1.logRefund)("Refund Created", refund, userId, {
            amount: refund.amount,
            paymentId: refund.paymentId,
            reason: refund.reason,
        });
        return refund;
    });
}
/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/
async function getAll(search, status, customerId, page = 1, limit = 20) {
    const data = await repository.getAll(search, status, customerId, page, limit);
    const total = await prisma_1.default.refund.count({
        where: {
            ...(status && { status }),
            ...(customerId && { customerId }),
            ...(search && {
                OR: [
                    {
                        refundNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        reason: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },
    });
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
| Get One
|--------------------------------------------------------------------------
*/
async function getOne(id) {
    const refund = await repository.findById(id);
    if (!refund) {
        throw new AppError_1.AppError("Refund not found.", 404);
    }
    return refund;
}
/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/
async function approve(id, userId, approvalNote) {
    const refund = await getOne(id);
    if (refund.status ===
        client_1.RefundStatus.APPROVED) {
        throw new AppError_1.AppError("Refund has already been approved.", 400);
    }
    if (refund.status ===
        client_1.RefundStatus.REJECTED) {
        throw new AppError_1.AppError("Rejected refunds cannot be approved.", 400);
    }
    return prisma_1.default.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
            where: {
                id: refund.paymentId,
            },
        });
        if (!payment) {
            throw new AppError_1.AppError("Payment not found.", 404);
        }
        const invoice = await tx.invoice.findUnique({
            where: {
                id: refund.invoiceId,
            },
        });
        if (!invoice) {
            throw new AppError_1.AppError("Invoice not found.", 404);
        }
        const refundedAmount = payment.refundedAmount +
            refund.amount;
        await tx.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                refundedAmount,
            },
        });
        const amountPaid = Math.max(0, invoice.amountPaid -
            refund.amount);
        const balance = invoice.total -
            amountPaid;
        let paymentStatus = client_1.InvoicePaymentStatus.PARTIAL;
        let invoiceStatus = client_1.InvoiceStatus.PARTIAL;
        if (amountPaid <= 0) {
            paymentStatus =
                client_1.InvoicePaymentStatus.UNPAID;
            invoiceStatus =
                client_1.InvoiceStatus.UNPAID;
        }
        if (balance <= 0) {
            paymentStatus =
                client_1.InvoicePaymentStatus.PAID;
            invoiceStatus =
                client_1.InvoiceStatus.PAID;
        }
        await tx.invoice.update({
            where: {
                id: invoice.id,
            },
            data: {
                amountPaid,
                balance,
                paymentStatus,
                status: invoiceStatus,
            },
        });
        const approvedRefund = await repository.update(tx, refund.id, {
            status: client_1.RefundStatus.APPROVED,
            approvedAt: new Date(),
            approvedBy: {
                connect: {
                    id: userId,
                },
            },
        });
        await (0, audit_log_service_1.logRefund)("Refund Approved", approvedRefund, userId, {
            approvalNote,
        });
        return approvedRefund;
    });
}
/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/
async function reject(id, reason, userId) {
    const refund = await getOne(id);
    if (refund.status !==
        client_1.RefundStatus.PENDING) {
        throw new AppError_1.AppError("Only pending refunds can be rejected.", 400);
    }
    const rejectedRefund = await repository.update(prisma_1.default, id, {
        status: client_1.RefundStatus.REJECTED,
        rejectionReason: reason,
    });
    await (0, audit_log_service_1.logRefund)("Refund Rejected", rejectedRefund, userId, {
        reason,
    });
    return rejectedRefund;
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function stats() {
    return repository.getStats();
}
