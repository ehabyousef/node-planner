import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { categories } from "../../DB/models/categories.model";

// Get all categories
export const getAllCategories = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const allCategories = await categories
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("goals", "title status priority");

    const totalCategories = await categories.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: allCategories,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCategories: totalCategories,
        limit: limit,
      },
    });
  },
);

// Get single category by ID
export const getSingleCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Category ID is required" });
      return;
    }

    const category = await categories
      .findById(id)
      .populate("goals", "title status priority progress_percent");

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({
      message: "Category found successfully",
      category,
    });
  },
);

// Create new category
export const createCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { Name, color } = req.body;

    // Check if category with same name exists
    const existingCategory = await categories.findOne({ Name });
    if (existingCategory) {
      res.status(400).json({ message: "Category with this name already exists" });
      return;
    }

    const category = new categories({
      Name,
      color,
    });

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  },
);

// Update category
export const updateCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Name, color } = req.body;

    if (!id) {
      res.status(400).json({ message: "Category ID is required" });
      return;
    }

    // Check if another category with the same name exists
    if (Name) {
      const existingCategory = await categories.findOne({
        Name,
        _id: { $ne: id },
      });
      if (existingCategory) {
        res.status(400).json({ message: "Category with this name already exists" });
        return;
      }
    }

    const category = await categories.findByIdAndUpdate(
      id,
      { Name, color },
      { new: true, runValidators: true },
    );

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  },
);

// Delete category
export const deleteCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Category ID is required" });
      return;
    }

    const category = await categories.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  },
);