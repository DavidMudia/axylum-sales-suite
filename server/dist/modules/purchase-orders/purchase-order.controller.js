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
exports.restore = restore;
exports.approve = approve;
exports.cancel = cancel;
exports.stats = stats;
const service = __importStar(require("./purchase-order.service"));
async function create(req, res) {
    const purchaseOrder = await service.create(req.body, req.user.id);
    return res.status(201).json({
        message: "Purchase Order created successfully.",
        purchaseOrder,
    });
}
async function getAll(req, res) {
    const search = req.query.search;
    const status = req.query.status;
    const supplierId = req.query.supplierId ? Number(req.query.supplierId) : undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const purchaseOrders = await service.getAll(search, status, supplierId, page, limit);
    return res.json(purchaseOrders);
}
async function getOne(req, res) {
    const purchaseOrder = await service.getOne(Number(req.params.id));
    return res.json(purchaseOrder);
}
async function update(req, res) {
    const purchaseOrder = await service.update(Number(req.params.id), req.body);
    return res.json({
        message: "Purchase Order updated successfully.",
        purchaseOrder,
    });
}
async function remove(req, res) {
    await service.remove(Number(req.params.id));
    return res.json({ message: "Purchase Order deleted successfully." });
}
async function restore(req, res) {
    const purchaseOrder = await service.restore(Number(req.params.id));
    return res.json({
        message: "Purchase Order restored successfully.",
        purchaseOrder,
    });
}
async function approve(req, res) {
    const purchaseOrder = await service.approve(Number(req.params.id), req.user.id);
    return res.json({
        message: "Purchase Order approved successfully.",
        purchaseOrder,
    });
}
async function cancel(req, res) {
    const purchaseOrder = await service.cancel(Number(req.params.id), req.user.id, req.body.reason);
    return res.json({
        message: "Purchase Order cancelled successfully.",
        purchaseOrder,
    });
}
async function stats(req, res) {
    const statistics = await service.stats();
    return res.json(statistics);
}
