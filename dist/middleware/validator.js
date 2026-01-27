"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const Validator = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};
exports.Validator = Validator;
