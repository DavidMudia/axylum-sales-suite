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
exports.stats = exports.reject = exports.approve = exports.getOne = exports.getAll = exports.create = void 0;
const service = __importStar(require("./refund.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
/*
|--------------------------------------------------------------------------
| Create Refund
|--------------------------------------------------------------------------
*/
exports.create = (0, catchAsync_1.default)(async (req, res) => {
    const refund = await service.create(req.body, req.user.id);
    res.status(201).json({
        success: true,
        message: "Refund created successfully.",
        data: refund,
    });
});
/*
|--------------------------------------------------------------------------
| Get All Refunds
|--------------------------------------------------------------------------
*/
exports.getAll = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service.getAll(req.query.search, req.query.status, req.query.customerId
        ? Number(req.query.customerId)
        : undefined, req.query.page
        ? Number(req.query.page)
        : 1, req.query.limit
        ? Number(req.query.limit)
        : 20);
    res.json({
        success: true,
        ...result,
    });
});
/*
|--------------------------------------------------------------------------
| Get Refund
|--------------------------------------------------------------------------
*/
exports.getOne = (0, catchAsync_1.default)(async (req, res) => {
    const refund = await service.getOne(Number(req.params.id));
    res.json({
        success: true,
        data: refund,
    });
});
/*
|--------------------------------------------------------------------------
| Approve Refund
|--------------------------------------------------------------------------
*/
exports.approve = (0, catchAsync_1.default)(async (req, res) => {
    const refund = await service.approve(Number(req.params.id), req.user.id, req.body.approvalNote);
    res.json({
        success: true,
        message: "Refund approved successfully.",
        data: refund,
    });
});
/*
|--------------------------------------------------------------------------
| Reject Refund
|--------------------------------------------------------------------------
*/
exports.reject = (0, catchAsync_1.default)(async (req, res) => {
    const refund = await service.reject(Number(req.params.id), req.body.reason, req.user.id);
    res.json({
        success: true,
        message: "Refund rejected.",
        data: refund,
    });
});
/*
|--------------------------------------------------------------------------
| Refund Statistics
|--------------------------------------------------------------------------
*/
exports.stats = (0, catchAsync_1.default)(async (req, res) => {
    const data = await service.stats();
    res.json({
        success: true,
        data,
    });
});
