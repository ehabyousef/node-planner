"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskValidation = exports.createTaskValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation for creating a new task (POST)
exports.createTaskValidation = joi_1.default.object({
    title: joi_1.default.string().required().min(2).max(100).messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 2 characters long",
        "string.max": "Title cannot exceed 100 characters",
    }),
    description: joi_1.default.string().required().min(2).max(500).messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 2 characters long",
        "string.max": "Description cannot exceed 500 characters",
    }),
    priority: joi_1.default.string().valid("LOW", "MEDIUM", "HIGH").default("LOW").messages({
        "any.only": "Priority must be LOW, MEDIUM, or HIGH",
    }),
    status: joi_1.default.string()
        .valid("TODO", "IN_PROGRESS", "DONE")
        .default("TODO")
        .messages({
        "any.only": "Status must be TODO, IN_PROGRESS, or DONE",
    }),
    start_date: joi_1.default.date().iso().optional().messages({
        "date.format": "Start date must be a valid ISO 8601 date",
    }),
    end_date: joi_1.default.date().iso().min(joi_1.default.ref("start_date")).optional().messages({
        "date.format": "End date must be a valid ISO 8601 date",
        "date.min": "End date must be after or equal to start date",
    }),
    goal_id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        "string.pattern.base": "Goal ID must be a valid MongoDB ObjectId",
        "any.required": "Goal ID is required",
    }),
});
// Validation for updating a task (PUT)
exports.updateTaskValidation = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).optional().messages({
        "string.min": "Title must be at least 2 characters long",
        "string.max": "Title cannot exceed 100 characters",
    }),
    description: joi_1.default.string().min(2).max(500).optional().messages({
        "string.min": "Description must be at least 2 characters long",
        "string.max": "Description cannot exceed 500 characters",
    }),
    priority: joi_1.default.string().valid("LOW", "MEDIUM", "HIGH").optional().messages({
        "any.only": "Priority must be LOW, MEDIUM, or HIGH",
    }),
    status: joi_1.default.string()
        .valid("TODO", "IN_PROGRESS", "DONE")
        .optional()
        .messages({
        "any.only": "Status must be TODO, IN_PROGRESS, or DONE",
    }),
    start_date: joi_1.default.date().iso().optional().messages({
        "date.format": "Start date must be a valid ISO 8601 date",
    }),
    end_date: joi_1.default.date().iso().optional().messages({
        "date.format": "End date must be a valid ISO 8601 date",
    }),
})
    .min(1)
    .messages({
    "object.min": "At least one field must be provided for update",
});
