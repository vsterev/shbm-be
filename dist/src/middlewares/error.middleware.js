"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const errorHandler = (err, req, res, next) => {
    if (err instanceof tsoa_1.ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err.status === 401) {
        console.warn(`Caught Authorization Error for ${req.path}:`, err.message);
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    if (err instanceof Error) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next(err);
};
exports.default = errorHandler;
//# sourceMappingURL=error.middleware.js.map