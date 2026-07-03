import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET should be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  PORT: z.coerce.number().default(5000),
});

export const env = envSchema.parse(process.env);