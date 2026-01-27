"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidation = joi_1.default.object({
    userName: joi_1.default.string().min(3).max(100).required().messages({
        "string.base": "userName must be a text",
        "string.empty": "userName is required",
        "string.min": "userName must be at least 3 characters",
        "string.max": "userName must be less than 50 characters",
        "any.required": "userName is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email must be valid",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});
exports.loginValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email must be valid",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});
