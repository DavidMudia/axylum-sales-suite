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
exports.activate = activate;
exports.deactivate = deactivate;
exports.remove = remove;
exports.restore = restore;
exports.stats = stats;
exports.dashboard = dashboard;
const service = __importStar(require("./warehouse.service"));
/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/
async function create(req, res) {
    const warehouse = await service.create(req.body);
    return res.status(201).json({
        message: "Warehouse created successfully.",
        warehouse,
    });
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/
async function getAll(req, res) {
    const search = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const warehouses = await service.getAll(search, page, limit);
    return res.json(warehouses);
}
/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/
async function getOne(req, res) {
    const warehouse = await service.getOne(Number(req.params.id));
    return res.json(warehouse);
}
/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/
async function update(req, res) {
    const warehouse = await service.update(Number(req.params.id), req.body);
    return res.json({
        message: "Warehouse updated successfully.",
        warehouse,
    });
}
/*
|--------------------------------------------------------------------------
| Activate
|--------------------------------------------------------------------------
*/
async function activate(req, res) {
    const warehouse = await service.activate(Number(req.params.id));
    return res.json({
        message: "Warehouse activated successfully.",
        warehouse,
    });
}
/*
|--------------------------------------------------------------------------
| Deactivate
|--------------------------------------------------------------------------
*/
async function deactivate(req, res) {
    const warehouse = await service.deactivate(Number(req.params.id));
    return res.json({
        message: "Warehouse deactivated successfully.",
        warehouse,
    });
}
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/
async function remove(req, res) {
    await service.remove(Number(req.params.id));
    return res.json({
        message: "Warehouse deleted successfully.",
    });
}
/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/
async function restore(req, res) {
    const warehouse = await service.restore(Number(req.params.id));
    return res.json({
        message: "Warehouse restored successfully.",
        warehouse,
    });
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
async function stats(req, res) {
    const statistics = await service.stats();
    return res.json(statistics);
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
async function dashboard(req, res) {
    const dashboard = await service.dashboard();
    return res.json(dashboard);
}
