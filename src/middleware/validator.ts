import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const Validator = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message),
    });
  }
  next();
};