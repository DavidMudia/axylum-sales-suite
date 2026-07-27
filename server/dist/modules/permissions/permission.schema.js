"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermissionSchema = void 0;
const zod_1 = require("zod");
exports.createPermissionSchema = zod_1.z.object({
    module: zod_1.z.string().min(2),
    action: zod_1.z.enum([
        "CREATE",
        "READ",
        "UPDATE",
        "DELETE",
        "APPROVE",
        "REJECT",
        "PRINT",
        "EXPORT",
        "POST",
        "CANCEL",
    ]),
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().optional(),
});
