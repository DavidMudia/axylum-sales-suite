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
exports.remove = remove;
exports.approve = approve;
exports.reject = reject;
exports.convertToInvoice = convertToInvoice;
const service = __importStar(require("./quote.service"));
async function create(req, res) {
    const quote = await service.create(req.body, req.user.id);
    res.status(201).json(quote);
}
async function getAll(req, res) {
    res.json(await service.getAll());
}
async function getOne(req, res) {
    res.json(await service.getOne(Number(req.params.id)));
}
async function remove(req, res) {
    await service.remove(Number(req.params.id));
    res.json({
        message: "Deleted",
    });
}
async function approve(req, res) {
    const quote = await service.approve(Number(req.params.id), req.user.id);
    res.json(quote);
}
async function reject(req, res) {
    const quote = await service.reject(Number(req.params.id), req.user.id, req.body.note);
    res.json(quote);
}
async function convertToInvoice(req, res) {
    const invoice = await service.convertToInvoice(Number(req.params.id), req.user.id);
    res.status(201).json(invoice);
}
