import { model, Model, Schema, Types } from "mongoose";
import { IGoal } from "../../utils/types";
// Interface for Goal model with static methods
interface IGoalModel extends Model<IGoal> {
  findWithProgress(filter?: any): Promise<any[]>;
}

const goalSchema = new Schema<IGoal, IGoalModel>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category_id: {
      type: Types.ObjectId,
      ref: "Categories",
      required: true,
      index: true,
    },
    title: {
      type: String,
      minlength: 2,
      maxlength: 100,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minlength: 2,
      maxlength: 500,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },
    progress_percent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    start_date: {
      type: Date,
      required: false,
    },
    end_date: {
      type: Date,
      required: false,
      validate: {
        validator: function (this: any, value: Date) {
          return !this.start_date || !value || value >= this.start_date;
        },
        message: "End date must be after or equal to start date",
      },
    },
  },
  { timestamps: true },
);

// Virtual for tasks (doesn't store in DB)
goalSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "goal_id",
});

// Enable virtuals in JSON
goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });

// Static method to get goal with calculated progress
goalSchema.statics.findWithProgress = async function (query) {
  const goals = await this.find(query);
  const Task = model("Task");

  for (const goal of goals) {
    const totalTasks = await Task.countDocuments({ goal_id: goal._id });
    if (totalTasks === 0) {
      goal.progress_percent = 0;
    } else {
      const completedTasks = await Task.countDocuments({
        goal_id: goal._id,
        status: "COMPLETED",
      });
      goal.progress_percent = Math.round((completedTasks / totalTasks) * 100);
    }
  }
  return goals;
};

export const goalModel = model<IGoal, IGoalModel>("Goal", goalSchema);
