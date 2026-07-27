// src/middleware/validate.middleware.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type Source = "body" | "query";

export const validate = (schema: ZodSchema, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data =
        source === "body"
          ? (req.body ?? {}) // ✅ Treat undefined body as an empty object
          : req.query;

      const parsed = schema.parse(data);

      if (source === "body") {
        req.body = parsed;
      } else {
        Object.assign(req.query, parsed);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};