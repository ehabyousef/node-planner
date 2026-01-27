"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoalValidation = exports.createGoalValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation for creating a new goal (POST)
exports.createGoalValidation = joi_1.default.object({
    title: joi_1.default.string().required().min(3).max(200).messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title cannot exceed 200 characters",
    }),
    description: joi_1.default.string().required().min(10).max(1000).messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters long",
        "string.max": "Description cannot exceed 1000 characters",
    }),
    priority: joi_1.default.string().valid("LOW", "MEDIUM", "HIGH").required().messages({
        "any.only": "Priority must be LOW, MEDIUM, or HIGH",
        "any.required": "Priority is required",
    }),
    status: joi_1.default.string()
        .valid("ACTIVE", "COMPLETED", "ARCHIVED")
        .default("ACTIVE")
        .messages({
        "any.only": "Status must be ACTIVE, COMPLETED, or ARCHIVED",
    }),
    start_date: joi_1.default.date().iso().optional().messages({
        "date.format": "Start date must be a valid ISO 8601 date",
    }),
    end_date: joi_1.default.date().iso().min(joi_1.default.ref("start_date")).optional().messages({
        "date.format": "End date must be a valid ISO 8601 date",
        "date.min": "End date must be after start date",
    }),
    category_id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
        "any.required": "Category ID is required",
    }),
});
// Validation for updating a goal (PUT)
exports.updateGoalValidation = joi_1.default.object({
    title: joi_1.default.string().min(3).max(200).optional().messages({
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title cannot exceed 200 characters",
    }),
    description: joi_1.default.string().min(10).max(1000).optional().messages({
        "string.min": "Description must be at least 10 characters long",
        "string.max": "Description cannot exceed 1000 characters",
    }),
    priority: joi_1.default.string().valid("LOW", "MEDIUM", "HIGH").optional().messages({
        "any.only": "Priority must be LOW, MEDIUM, or HIGH",
    }),
    status: joi_1.default.string()
        .valid("ACTIVE", "COMPLETED", "ARCHIVED")
        .optional()
        .messages({
        "any.only": "Status must be ACTIVE, COMPLETED, or ARCHIVED",
    }),
    end_date: joi_1.default.date().iso().optional().messages({
        "date.format": "End date must be a valid ISO 8601 date",
    }),
    progress_percent: joi_1.default.number().min(0).max(100).optional().messages({
        "number.min": "Progress must be at least 0",
        "number.max": "Progress cannot exceed 100",
    }),
}).min(1).messages({
    "object.min": "At least one field must be provided for update",
});
