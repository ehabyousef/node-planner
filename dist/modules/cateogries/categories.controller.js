"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getSingleCategory = exports.getAllCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const categories_model_1 = require("../../DB/models/categories.model");
// Get all categories
exports.getAllCategories = (0, express_async_handler_1.default)(async (req, res) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const allCategories = await categories_model_1.categories
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("goals", "title status priority");
    const totalCategories = await categories_model_1.categories.countDocuments();
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
});
// Get single category by ID
exports.getSingleCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Category ID is required" });
        return;
    }
    const category = await categories_model_1.categories
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
});
// Create new category
exports.createCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { Name, color } = req.body;
    // Check if category with same name exists
    const existingCategory = await categories_model_1.categories.findOne({ Name });
    if (existingCategory) {
        res.status(400).json({ message: "Category with this name already exists" });
        return;
    }
    const category = new categories_model_1.categories({
        Name,
        color,
    });
    await category.save();
    res.status(201).json({
        message: "Category created successfully",
        category,
    });
});
// Update category
exports.updateCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { Name, color } = req.body;
    if (!id) {
        res.status(400).json({ message: "Category ID is required" });
        return;
    }
    // Check if another category with the same name exists
    if (Name) {
        const existingCategory = await categories_model_1.categories.findOne({
            Name,
            _id: { $ne: id },
        });
        if (existingCategory) {
            res.status(400).json({ message: "Category with this name already exists" });
            return;
        }
    }
    const category = await categories_model_1.categories.findByIdAndUpdate(id, { Name, color }, { new: true, runValidators: true });
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    res.status(200).json({
        message: "Category updated successfully",
        category,
    });
});
// Delete category
exports.deleteCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Category ID is required" });
        return;
    }
    const category = await categories_model_1.categories.findByIdAndDelete(id);
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    res.status(200).json({
        message: "Category deleted successfully",
    });
});
