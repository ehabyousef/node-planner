import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { IGoal } from "../../utils/types";
import { goalModel } from "../../DB/models/goal.model";

export const addGoal = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      priority,
      status,
      start_date,
      end_date,
      category_id,
    }: IGoal = req.body;

    const createdBy = (req as any).user.id;

    const goal = new goalModel({
      title: title,
      description: description,
      priority: priority,
      status: status,
      start_date: start_date,
      end_date: end_date,
      user: createdBy,
      category_id: category_id,
    });

    await goal.save();
    res.status(201).json({ message: "created goal successfully" });
  },
);

export const allGoals = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const createdBy = (req as any).user.id;
    if (!createdBy) {
      res.status(400).json({ message: "login first" });
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const goals = await goalModel
      .find({ user: createdBy })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalGoals = await goalModel.countDocuments({ user: createdBy });
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
  },
);

export const singleGoal = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const createdBy = (req as any).user.id;
    const { id } = req.params;

    if (!createdBy) {
      res.status(400).json({ message: "login first" });
    }

    if (!id) {
      res.status(400).json({ message: "goal ID is required" });
    }

    const goal = await goalModel.findById(id);

    if (!goal) {
      res.status(404).json({ message: "goal not found or unauthorized" });
    }

    res.status(200).json({ message: "found goal successfully", goal });
  },
);

export const updateGoal = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, priority, status, end_date }: IGoal = req.body;
    const createdBy = (req as any).user.id;
    const { id } = req.params;

    if (!createdBy) {
      res.status(400).json({ message: "login first" });
    }

    if (!id) {
      res.status(400).json({ message: "goal ID is required" });
    }

    const goal = await goalModel.findOneAndUpdate(
      { _id: id, user: createdBy },
      {
        title,
        description,
        priority,
        status,
        end_date,
      },
      { new: true, runValidators: true },
    );

    if (!goal) {
      res.status(404).json({ message: "goal not found or unauthorized" });
    }

    res.status(200).json({ message: "goal updated successfully", goal });
  },
);

export const deleteGoal = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const createdBy = (req as any).user.id;
    const { id } = req.params;

    if (!createdBy) {
      res.status(400).json({ message: "login first" });
    }

    if (!id) {
      res.status(400).json({ message: "goal ID is required" });
    }

    const goal = await goalModel.findByIdAndDelete(id);

    if (!goal) {
      res.status(404).json({ message: "goal not found or unauthorized" });
    }

    res.status(200).json({ message: "goal deleted successfully" });
  },
);
