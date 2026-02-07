import { model, Schema, Types } from "mongoose";

const taskSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal_id: {
      type: Types.ObjectId,
      ref: "Goal",
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
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
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
    completed_at: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

// Compound index for efficient queries
taskSchema.index({ user: 1, goal_id: 1 });
taskSchema.index({ goal_id: 1, status: 1 });

// Auto-set completed_at when task is marked as completed
taskSchema.pre("save", function () {
  if (this.isModified("status")) {
    if (this.status === "DONE" && !this.completed_at) {
      this.completed_at = new Date();
    } else if (this.status !== "DONE") {
      this.completed_at = undefined;
    }
  }
});

// Helper function to update goal progress
async function updateGoalProgress(goalId: Types.ObjectId) {
  const Task = model("Task");
  const Goal = model("Goal");

  const totalTasks = await Task.countDocuments({ goal_id: goalId });
  
  if (totalTasks === 0) {
    await Goal.findByIdAndUpdate(goalId, { progress_percent: 0 });
  } else {
    const completedTasks = await Task.countDocuments({
      goal_id: goalId,
      status: "DONE",
    });
    const progress = Math.round((completedTasks / totalTasks) * 100);
    await Goal.findByIdAndUpdate(goalId, { progress_percent: progress });
  }
}

// Update goal progress after task is saved
taskSchema.post("save", async function () {
  await updateGoalProgress(this.goal_id);
});

// Update goal progress after task is updated
taskSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updateGoalProgress(doc.goal_id);
  }
});

// Update goal progress after task is deleted
taskSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateGoalProgress(doc.goal_id);
  }
});

taskSchema.post("deleteOne", async function (doc) {
  if (doc && (doc as any).goal_id) {
    await updateGoalProgress((doc as any).goal_id);
  }
});

export const taskModel = model("Task", taskSchema);
