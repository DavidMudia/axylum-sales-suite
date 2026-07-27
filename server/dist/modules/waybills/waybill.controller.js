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
exports.updateStatus = updateStatus;
exports.stats = stats;
const service = __importStar(require("./waybill.service"));
/*
|--------------------------------------------------------------------------
| Create Waybill
|--------------------------------------------------------------------------
*/
async function create(req, res) {
    const waybill = await service.create(req.body, req.user.id);
    return res.status(201).json({
        message: "Waybill created successfully.",
        waybill,
    });
}
/*
|--------------------------------------------------------------------------
| Get All Waybills
|--------------------------------------------------------------------------
*/
async function getAll(req, res) {
    const search = req.query.search;
    const status = req.query.status;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const waybills = await service.getAll(search, status, page, limit);
    return res.json(waybills);
}
/*
|--------------------------------------------------------------------------
| Get Single Waybill
|--------------------------------------------------------------------------
*/
async function getOne(req, res) {
    const waybill = await service.getOne(Number(req.params.id));
    return res.json(waybill);
}
/*
|--------------------------------------------------------------------------
| Update Waybill Status
|--------------------------------------------------------------------------
*/
async function updateStatus(req, res) {
    const waybill = await service.updateStatus(Number(req.params.id), req.body.status, req.user.id);
    return res.json({
        message: "Waybill status updated successfully.",
        waybill,
    });
}
/*
|--------------------------------------------------------------------------
| Waybill Statistics
|--------------------------------------------------------------------------
*/
async function stats(req, res) {
    const statistics = await service.stats();
    return res.json(statistics);
}
