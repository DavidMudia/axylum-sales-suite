"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, source = "body") => {
    return (req, res, next) => {
        try {
            const data = source === "body"
                ? (req.body ?? {}) // ✅ Treat undefined body as an empty object
                : req.query;
            const parsed = schema.parse(data);
            if (source === "body") {
                req.body = parsed;
            }
            else {
                Object.assign(req.query, parsed);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
