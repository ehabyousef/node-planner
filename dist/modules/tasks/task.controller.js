"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletetask = exports.updateTask = exports.singleTask = exports.addTask = exports.goalTasks = exports.getTasks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tasks_model_1 = require("../../DB/models/tasks.model");
exports.getTasks = (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "login first" });
    }
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tasks = await tasks_model_1.taskModel
        .find({ user: user.id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 })
        .populate("title"); // ✅ Populate goal title
    const totalTasks = await tasks_model_1.taskModel.countDocuments({
        user: user.id,
    });
    const totalPages = Math.ceil(totalTasks / limit);
    res.status(200).json({
        message: "got all tasks",
        tasks: tasks,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalTasks: totalTasks,
            limit: limit,
        },
    });
});
exports.goalTasks = (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    const { goalId } = req.params;
    if (!user) {
        res.status(400).json({ message: "login first" });
    }
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tasks = await tasks_model_1.taskModel
        .find({ user: user.id, goal_id: goalId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 })
        .populate("title"); // ✅ Populate goal title
    const totalTasks = await tasks_model_1.taskModel.countDocuments({
        user: user.id,
        goal_id: goalId,
    });
    const totalPages = Math.ceil(totalTasks / limit);
    res.status(200).json({
        message: "got all tasks",
        tasks: tasks,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalTasks: totalTasks,
            limit: limit,
        },
    });
});
exports.addTask = (0, express_async_handler_1.default)(async (req, res) => {
    const { title, description, priority, status, start_date, end_date, goal_id, } = req.body;
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "login first" });
    }
    const task = new tasks_model_1.taskModel({
        title: title,
        description: description,
        priority: priority,
        status: status,
        start_date: start_date,
        end_date: end_date,
        user: user.id,
        goal_id: goal_id,
    });
    await task.save();
    res.status(201).json({ message: "created task successfully" });
});
exports.singleTask = (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { goalId } = req.params;
    // ✅ Find task and verify ownership in one query
    const task = await tasks_model_1.taskModel.findOne({
        _id: id,
        user: user.id,
        goal_id: goalId,
    });
    if (!task) {
        res.status(404).json({ message: "task not found or unauthorized" });
    }
    res.status(200).json({ message: "found your task successfully", task });
});
exports.updateTask = (0, express_async_handler_1.default)(async (req, res) => {
    const { title, description, priority, status, end_date } = req.body;
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "login first" });
    }
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "task ID is required" });
    }
    const task = await tasks_model_1.taskModel.findOneAndUpdate({ _id: id, user: user.id }, {
        title,
        description,
        priority,
        status,
        end_date,
    }, { new: true, runValidators: true });
    if (!task) {
        res.status(404).json({ message: "task not found or unauthorized" });
    }
    res.status(200).json({ message: "task updated successfully", task });
});
exports.deletetask = (0, express_async_handler_1.default)(async (req, res) => {
    const createdBy = req.user.id;
    const { id } = req.params;
    if (!createdBy) {
        res.status(400).json({ message: "login first" });
    }
    if (!id) {
        res.status(400).json({ message: "task ID is required" });
    }
    const task = await tasks_model_1.taskModel.findByIdAndDelete(id);
    if (!task) {
        res.status(404).json({ message: "task not found or unauthorized" });
    }
    res.status(200).json({ message: "task deleted successfully" });
});
