import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { IGoal } from "../../utils/types";
import { goalModel } from "../../DB/models/goal.model";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary";

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

    // Prepare goal data
    const goalData: any = {
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
        const uploadResult = await uploadToCloudinary(req.file.buffer, "goals");

        // Add image data to goal
        goalData.image = {
          id: uploadResult.id,
          url: uploadResult.url,
        };
      } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ message: "Failed to upload image" });
        return;
      }
    }

    const goal = new goalModel(goalData);
    await goal.save();
    
    res.status(201).json({ 
      message: "created goal successfully", 
      goal: goal 
    });
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

    const goal = await goalModel.findOne({ _id: id, user: createdBy });

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
      return;
    }

    if (!id) {
      res.status(400).json({ message: "goal ID is required" });
      return;
    }

    // Prepare update data
    const updateData: any = {
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
        const existingGoal = await goalModel.findOne({ _id: id, user: createdBy });
        
        if (existingGoal?.image?.id) {
          // Delete old image from Cloudinary
          await deleteFromCloudinary(existingGoal.image.id);
        }

        // Upload buffer directly to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, "goals");

        updateData.image = {
          id: uploadResult.id,
          url: uploadResult.url,
        };
      } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ message: "Failed to upload image" });
        return;
      }
    }

    const goal = await goalModel.findOneAndUpdate(
      { _id: id, user: createdBy },
      updateData,
      { new: true, runValidators: true },
    );

    if (!goal) {
      res.status(404).json({ message: "goal not found or unauthorized" });
      return;
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
      return;
    }

    if (!id) {
      res.status(400).json({ message: "goal ID is required" });
      return;
    }

    const goal = await goalModel.findById(id);

    if (!goal) {
      res.status(404).json({ message: "goal not found or unauthorized" });
      return;
    }

    // Delete image from Cloudinary if exists
    if (goal.image?.id) {
      try {
        await deleteFromCloudinary(goal.image.id);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        // Continue with goal deletion even if image deletion fails
      }
    }

    await goalModel.findByIdAndDelete(id);
    res.status(200).json({ message: "goal deleted successfully" });
  },
);
