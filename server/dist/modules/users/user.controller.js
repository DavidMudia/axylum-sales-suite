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
exports.changePassword = changePassword;
const service = __importStar(require("./user.service"));
/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/
async function create(req, res) {
    const user = await service.create(req.body);
    return res.status(201).json({
        message: "User created successfully.",
        user,
    });
}
/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/
async function getAll(req, res) {
    const search = req.query.search;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) ||
        20;
    const users = await service.getAll(search, page, limit);
    return res.json(users);
}
/*
|--------------------------------------------------------------------------
| Get One User
|--------------------------------------------------------------------------
*/
async function getOne(req, res) {
    const user = await service.getOne(Number(req.params.id));
    return res.json(user);
}
/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/
async function update(req, res) {
    const user = await service.update(Number(req.params.id), {
        ...req.body,
        currentUserId: req.user.id, // add the logged-in user's id
    });
    // ...
}
/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/
async function activate(req, res) {
    const user = await service.activate(Number(req.params.id));
    return res.json({
        message: "User activated successfully.",
        user,
    });
}
/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/
async function deactivate(req, res) {
    const user = await service.deactivate(Number(req.params.id));
    return res.json({
        message: "User deactivated successfully.",
        user,
    });
}
/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/
async function remove(req, res) {
    await service.remove(Number(req.params.id));
    return res.json({
        message: "User deleted successfully.",
    });
}
/*
|--------------------------------------------------------------------------
| Restore User
|--------------------------------------------------------------------------
*/
async function restore(req, res) {
    const user = await service.restore(Number(req.params.id));
    return res.json({
        message: "User restored successfully.",
        user,
    });
}
/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/
async function stats(req, res) {
    const statistics = await service.stats();
    return res.json(statistics);
}
async function changePassword(req, res) {
    const userId = req.user.id;
    await service.changePassword(userId, req.body.currentPassword, req.body.newPassword);
    res.json({ message: "Password changed successfully." });
}
