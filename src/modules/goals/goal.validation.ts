import Joi from "joi";

// Validation for creating a new goal (POST)
export const createGoalValidation = Joi.object({
  title: Joi.string().required().min(3).max(200).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 200 characters",
  }),
  description: Joi.string().required().min(10).max(1000).messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
  }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").required().messages({
    "any.only": "Priority must be LOW, MEDIUM, or HIGH",
    "any.required": "Priority is required",
  }),
  status: Joi.string()
    .valid("ACTIVE", "COMPLETED", "ARCHIVED")
    .default("ACTIVE")
    .messages({
      "any.only": "Status must be ACTIVE, COMPLETED, or ARCHIVED",
    }),
  start_date: Joi.date().iso().optional().messages({
    "date.format": "Start date must be a valid ISO 8601 date",
  }),
  end_date: Joi.date().iso().min(Joi.ref("start_date")).optional().messages({
    "date.format": "End date must be a valid ISO 8601 date",
    "date.min": "End date must be after start date",
  }),
  category_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
      "any.required": "Category ID is required",
    }),
});

// Validation for updating a goal (PUT)
export const updateGoalValidation = Joi.object({
  title: Joi.string().min(3).max(200).optional().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 200 characters",
  }),
  description: Joi.string().min(10).max(1000).optional().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
  }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional().messages({
    "any.only": "Priority must be LOW, MEDIUM, or HIGH",
  }),
  status: Joi.string()
    .valid("ACTIVE", "COMPLETED", "ARCHIVED")
    .optional()
    .messages({
      "any.only": "Status must be ACTIVE, COMPLETED, or ARCHIVED",
    }),
  end_date: Joi.date().iso().optional().messages({
    "date.format": "End date must be a valid ISO 8601 date",
  }),
  progress_percent: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Progress must be at least 0",
    "number.max": "Progress cannot exceed 100",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});