import Joi from "joi";

// Validation for creating a new task (POST)
export const createTaskValidation = Joi.object({
  title: Joi.string().required().min(2).max(100).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().required().min(2).max(500).messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 2 characters long",
    "string.max": "Description cannot exceed 500 characters",
  }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").default("LOW").messages({
    "any.only": "Priority must be LOW, MEDIUM, or HIGH",
  }),
  status: Joi.string()
    .valid("TODO", "IN_PROGRESS", "DONE")
    .default("TODO")
    .messages({
      "any.only": "Status must be TODO, IN_PROGRESS, or DONE",
    }),
  start_date: Joi.date().iso().optional().messages({
    "date.format": "Start date must be a valid ISO 8601 date",
  }),
  end_date: Joi.date().iso().min(Joi.ref("start_date")).optional().messages({
    "date.format": "End date must be a valid ISO 8601 date",
    "date.min": "End date must be after or equal to start date",
  }),
  goal_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Goal ID must be a valid MongoDB ObjectId",
      "any.required": "Goal ID is required",
    }),
});

// Validation for updating a task (PUT)
export const updateTaskValidation = Joi.object({
  title: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Title must be at least 2 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().min(2).max(500).optional().messages({
    "string.min": "Description must be at least 2 characters long",
    "string.max": "Description cannot exceed 500 characters",
  }),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional().messages({
    "any.only": "Priority must be LOW, MEDIUM, or HIGH",
  }),
  status: Joi.string()
    .valid("TODO", "IN_PROGRESS", "DONE")
    .optional()
    .messages({
      "any.only": "Status must be TODO, IN_PROGRESS, or DONE",
    }),
  start_date: Joi.date().iso().optional().messages({
    "date.format": "Start date must be a valid ISO 8601 date",
  }),
  end_date: Joi.date().iso().optional().messages({
    "date.format": "End date must be a valid ISO 8601 date",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
