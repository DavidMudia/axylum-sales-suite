"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const auth_service_1 = require("./auth.service");
async function register(req, res) {
    const user = await (0, auth_service_1.registerUser)(req.body);
    return res.status(201).json({
        message: "User registered successfully",
        user,
    });
}
async function login(req, res) {
    const result = await (0, auth_service_1.loginUser)(req.body);
    return res.status(200).json({
        message: "Login successful",
        ...result,
    });
}
async function me(req, res) {
    return res.status(200).json({
        message: "Authenticated",
        user: req.user,
    });
}
