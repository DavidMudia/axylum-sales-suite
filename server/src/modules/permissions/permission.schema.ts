import { z } from "zod";

export const createPermissionSchema = z.object({
    module: z.string().min(2),

    action: z.enum([
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

    name: z.string().min(3).max(100),

    description: z.string().optional(),
});