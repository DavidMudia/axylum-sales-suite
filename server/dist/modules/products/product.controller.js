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
exports.lowStock = lowStock;
const service = __importStar(require("./product.service"));
async function create(req, res) {
    const product = await service.create({
        ...req.body,
        createdById: req.user.id,
    });
    res.status(201).json(product);
}
async function getAll(req, res) {
    const products = await service.getAll(req.query.search, req.query.page ? Number(req.query.page) : 1, req.query.limit ? Number(req.query.limit) : 20);
    res.json(products);
}
async function getOne(req, res) {
    const product = await service.getOne(Number(req.params.id));
    res.json(product);
}
async function update(req, res) {
    const product = await service.update(Number(req.params.id), {
        ...req.body,
        updatedById: req.user.id, // pass userId for password verification
    });
    res.json(product);
}
async function remove(req, res) {
    await service.remove(Number(req.params.id));
    res.json({ message: "Product deleted successfully." });
}
async function restore(req, res) {
    const product = await service.restore(Number(req.params.id));
    res.json(product);
}
async function lowStock(req, res) {
    const products = await service.lowStock();
    res.json(products);
}
