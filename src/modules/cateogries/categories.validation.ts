import Joi from "joi";

// Validation for creating a new category (POST)
export const createCategoryValidation = Joi.object({
  Name: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 3 characters long",
    "string.max": "Category name cannot exceed 100 characters",
  }),
  color: Joi.string()
    .required()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .messages({
      "string.empty": "Color is required",
      "string.pattern.base": "Color must be a valid hex color (e.g., #FF5733)",
    }),
});

// Validation for updating a category (PUT)
export const updateCategoryValidation = Joi.object({
  Name: Joi.string().min(3).max(100).optional().messages({
    "string.min": "Category name must be at least 3 characters long",
    "string.max": "Category name cannot exceed 100 characters",
  }),
  color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .messages({
      "string.pattern.base": "Color must be a valid hex color (e.g., #FF5733)",
    }),
});
