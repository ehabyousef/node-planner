import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { IGoal, ITask } from "../../utils/types";
import { goalModel } from "../../DB/models/goal.model";
import { taskModel } from "../../DB/models/tasks.model";

export const getTasks = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) {
      res.status(400).json({ message: "login first" });
    }

    // pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const tasks = await taskModel
      .find({ user: user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTasks = await taskModel.countDocuments({ user: user.id });
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
  },
);

export const addTask = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      priority,
      status,
      start_date,
      end_date,
      goal_id,
    }: ITask = req.body;

    const user = (req as any).user;
    if (!user) {
      res.status(400).json({ message: "login first" });
    }

    const task = new taskModel({
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
  },
);

export const singleTask = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { id } = req.params;

    // ✅ Find task and verify ownership in one query
    const task = await taskModel.findOne({ _id: id, user: user.id });

    if (!task) {
      res.status(404).json({ message: "task not found or unauthorized" });
    }

    res.status(200).json({ message: "found your task successfully", task });
  },
);

export const updateTask = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, priority, status, end_date }: ITask = req.body;

    const user = (req as any).user;
    if (!user) {
      res.status(400).json({ message: "login first" });
    }
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "task ID is required" });
    }
    const task = await taskModel.findOneAndUpdate(
      { _id: id, user: user.id },
      {
        title,
        description,
        priority,
        status,
        end_date,
      },
      { new: true, runValidators: true },
    );
    if (!task) {
      res.status(404).json({ message: "task not found or unauthorized" });
    }

    res.status(200).json({ message: "task updated successfully", task });
  },
);

export const deletetask = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const createdBy = (req as any).user.id;
    const { id } = req.params;

    if (!createdBy) {
      res.status(400).json({ message: "login first" });
    }

    if (!id) {
      res.status(400).json({ message: "task ID is required" });
    }

    const task = await taskModel.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({ message: "task not found or unauthorized" });
    }

    res.status(200).json({ message: "task deleted successfully" });
  },
);
