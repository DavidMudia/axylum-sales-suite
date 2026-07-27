"use strict";
// server/src/modules/payments/payment.controller.ts
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
exports.approve = approve;
exports.cancel = cancel;
exports.stats = stats;
const service = __importStar(require("./payment.service"));
async function create(req, res) {
    const payment = await service.create(req.body, req.user.id);
    res.status(201).json(payment);
}
async function getAll(req, res) {
    const search = req.query.search;
    const status = req.query.status;
    const method = req.query.method;
    const customerId = req.query.customerId
        ? Number(req.query.customerId)
        : undefined;
    // ✅ NEW
    const refundable = req.query.refundable === "true";
    const page = req.query.page
        ? Number(req.query.page)
        : 1;
    const limit = req.query.limit
        ? Number(req.query.limit)
        : 20;
    const payments = await service.getAll(search, status, method, customerId, refundable, page, limit);
    res.json(payments);
}
async function getOne(req, res) {
    const id = Number(req.params.id);
    const payment = await service.getOne(id);
    res.json(payment);
}
async function update(req, res) {
    const payment = await service.update(Number(req.params.id), req.body);
    res.json(payment);
}
async function approve(req, res) {
    const payment = await service.approve(Number(req.params.id), req.user.id);
    res.json(payment);
}
async function cancel(req, res) {
    const payment = await service.cancel(Number(req.params.id), req.user.id, req.body.reason);
    res.json(payment);
}
async function stats(req, res) {
    const data = await service.stats();
    res.json(data);
}
