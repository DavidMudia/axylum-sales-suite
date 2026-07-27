"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET should be at least 32 characters"),
    JWT_EXPIRES_IN: zod_1.z.string().default("1h"),
    PORT: zod_1.z.coerce.number().default(5000),
});
exports.env = envSchema.parse(process.env);
