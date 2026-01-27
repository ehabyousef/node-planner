"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryValidation = exports.createCategoryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation for creating a new category (POST)
exports.createCategoryValidation = joi_1.default.object({
    Name: joi_1.default.string().required().min(3).max(100).messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 3 characters long",
        "string.max": "Category name cannot exceed 100 characters",
    }),
    color: joi_1.default.string()
        .required()
        .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .messages({
        "string.empty": "Color is required",
        "string.pattern.base": "Color must be a valid hex color (e.g., #FF5733)",
    }),
});
// Validation for updating a category (PUT)
exports.updateCategoryValidation = joi_1.default.object({
    Name: joi_1.default.string().min(3).max(100).optional().messages({
        "string.min": "Category name must be at least 3 characters long",
        "string.max": "Category name cannot exceed 100 characters",
    }),
    color: joi_1.default.string()
        .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .optional()
        .messages({
        "string.pattern.base": "Color must be a valid hex color (e.g., #FF5733)",
    }),
});
