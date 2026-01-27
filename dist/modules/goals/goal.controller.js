"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.singleGoal = exports.allGoals = exports.addGoal = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const goal_model_1 = require("../../DB/models/goal.model");
const cloudinary_1 = require("../../utils/cloudinary");
exports.addGoal = (0, express_async_handler_1.default)(async (req, res) => {
    const { title, description, priority, status, start_date, end_date, category_id, } = req.body;
    const createdBy = req.user.id;
    // Prepare goal data
    const goalData = {
        title: title,
        description: description,
        priority: priority,
        status: status,
        start_date: start_date,
        end_date: end_date,
        user: createdBy,
        category_id: category_id,
    };
    // Handle image upload if file is present
    if (req.file) {
        try {
            // Upload buffer directly to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "goals");
            // Add image data to goal
            goalData.image = {
                id: uploadResult.id,
                url: uploadResult.url,
            };
        }
        catch (error) {
            console.error("Image upload error:", error);
            res.status(500).json({ message: "Failed to upload image" });
            return;
        }
    }
    const goal = new goal_model_1.goalModel(goalData);
    await goal.save();
    res.status(201).json({
        message: "created goal successfully",
        goal: goal
    });
});
exports.allGoals = (0, express_async_handler_1.default)(async (req, res) => {
    const createdBy = req.user.id;
    if (!createdBy) {
        res.status(400).json({ message: "login first" });
    }
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const goals = await goal_model_1.goalModel
        .find({ user: createdBy })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const totalGoals = await goal_model_1.goalModel.countDocuments({ user: createdBy });
    const totalPages = Math.ceil(totalGoals / limit);
    res.status(200).json({
        message: "get all goals successfully",
        goals: goals,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalGoals: totalGoals,
            limit: limit,
        },
    });
});
exports.singleGoal = (0, express_async_handler_1.default)(async (req, res) => {
    const createdBy = req.user.id;
    const { id } = req.params;
    if (!createdBy) {
        res.status(400).json({ message: "login first" });
    }
    if (!id) {
        res.status(400).json({ message: "goal ID is required" });
    }
    const goal = await goal_model_1.goalModel.findOne({ _id: id, user: createdBy });
    if (!goal) {
        res.status(404).json({ message: "goal not found or unauthorized" });
    }
    res.status(200).json({ message: "found goal successfully", goal });
});
exports.updateGoal = (0, express_async_handler_1.default)(async (req, res) => {
    const { title, description, priority, status, end_date } = req.body;
    const createdBy = req.user.id;
    const { id } = req.params;
    if (!createdBy) {
        res.status(400).json({ message: "login first" });
        return;
    }
    if (!id) {
        res.status(400).json({ message: "goal ID is required" });
        return;
    }
    // Prepare update data
    const updateData = {
        title,
        description,
        priority,
        status,
        end_date,
    };
    // Handle new image upload
    if (req.file) {
        try {
            // Get existing goal to delete old image
            const existingGoal = await goal_model_1.goalModel.findOne({ _id: id, user: createdBy });
            if (existingGoal?.image?.id) {
                // Delete old image from Cloudinary
                await (0, cloudinary_1.deleteFromCloudinary)(existingGoal.image.id);
            }
            // Upload buffer directly to Cloudinary
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, "goals");
            updateData.image = {
                id: uploadResult.id,
                url: uploadResult.url,
            };
        }
        catch (error) {
            console.error("Image upload error:", error);
            res.status(500).json({ message: "Failed to upload image" });
            return;
        }
    }
    const goal = await goal_model_1.goalModel.findOneAndUpdate({ _id: id, user: createdBy }, updateData, { new: true, runValidators: true });
    if (!goal) {
        res.status(404).json({ message: "goal not found or unauthorized" });
        return;
    }
    res.status(200).json({ message: "goal updated successfully", goal });
});
exports.deleteGoal = (0, express_async_handler_1.default)(async (req, res) => {
    const createdBy = req.user.id;
    const { id } = req.params;
    if (!createdBy) {
        res.status(400).json({ message: "login first" });
        return;
    }
    if (!id) {
        res.status(400).json({ message: "goal ID is required" });
        return;
    }
    const goal = await goal_model_1.goalModel.findById(id);
    if (!goal) {
        res.status(404).json({ message: "goal not found or unauthorized" });
        return;
    }
    // Delete image from Cloudinary if exists
    if (goal.image?.id) {
        try {
            await (0, cloudinary_1.deleteFromCloudinary)(goal.image.id);
        }
        catch (error) {
            console.error("Failed to delete image from Cloudinary:", error);
            // Continue with goal deletion even if image deletion fails
        }
    }
    await goal_model_1.goalModel.findByIdAndDelete(id);
    res.status(200).json({ message: "goal deleted successfully" });
});
