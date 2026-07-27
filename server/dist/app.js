"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const app = (0, express_1.default)();
console.log("1");
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
console.log("2");
app.use((0, helmet_1.default)());
console.log("3");
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
console.log("4");
app.use(express_1.default.json());
console.log("5");
app.use("/api/auth", auth_routes_1.default);
console.log("6");
app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("Authentication API Running 🚀");
});
console.log("7");
app.use("/api/dashboard", dashboard_routes_1.default);
exports.default = app;
