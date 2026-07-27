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
exports.getAll = getAll;
exports.getOne = getOne;
exports.reserve = reserve;
exports.release = release;
exports.adjust = adjust;
exports.transfer = transfer;
exports.lowStock = lowStock;
exports.outOfStock = outOfStock;
exports.history = history;
exports.stats = stats;
const client_1 = require("@prisma/client");
const service = __importStar(require("./inventory.service"));
async function getAll(req, res) {
    const search = req.query.search;
    const warehouseId = req.query.warehouseId
        ? Number(req.query.warehouseId)
        : undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const inventory = await service.getAll(search, page, limit);
    return res.json(inventory);
}
async function getOne(req, res) {
    const inventory = await service.getOne(Number(req.params.id));
    return res.json(inventory);
}
async function reserve(req, res) {
    await service.reserveStock(Number(req.params.id), req.body.quantity, req.user.id, client_1.InventoryReferenceType.SALES_ORDER, req.body.referenceId);
    return res.json({
        message: "Stock reserved successfully.",
    });
}
async function release(req, res) {
    await service.releaseStock(Number(req.params.id), req.body.quantity, req.user.id, client_1.InventoryReferenceType.SALES_ORDER, req.body.referenceId);
    return res.json({
        message: "Reserved stock released.",
    });
}
async function adjust(req, res) {
    const inventory = await service.adjust(Number(req.params.id), req.body, req.user.id);
    return res.json({
        message: "Inventory adjusted successfully.",
        inventory,
    });
}
async function transfer(req, res) {
    const inventory = await service.transfer(req.body, req.user.id);
    return res.json({
        message: "Inventory transferred successfully.",
        inventory,
    });
}
async function lowStock(req, res) {
    const items = await service.lowStock();
    return res.json(items);
}
async function outOfStock(req, res) {
    const items = await service.outOfStock();
    return res.json(items);
}
/*
|--------------------------------------------------------------------------
| Inventory Movement History
|--------------------------------------------------------------------------
*/
async function history(req, res) {
    const history = await service.history(Number(req.params.id));
    return res.json(history);
}
async function stats(req, res) {
    const stats = await service.stats();
    return res.json(stats);
}
