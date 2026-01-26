import express from "express";
import { Validator } from "../../middleware/validator";
import { verifyToken } from "../../middleware/verifyToken";
import { requireAuth } from "../../middleware/requireAuth";
import {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.controller";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "./categories.validation";

export const categoriesRouter = express.Router();

// Apply authentication middleware
categoriesRouter.use(verifyToken, requireAuth);

// GET routes
categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getSingleCategory);

// POST routes
categoriesRouter.post(
  "/addCategory",
  Validator(createCategoryValidation),
  createCategory,
);

// PUT routes
categoriesRouter.put(
  "/updateCategory/:id",
  Validator(updateCategoryValidation),
  updateCategory,
);

// DELETE routes
categoriesRouter.delete("/deleteCategory/:id", deleteCategory);
