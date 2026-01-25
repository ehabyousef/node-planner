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
taskSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "COMPLETED" && !this.completed_at) {
      this.completed_at = new Date();
    } else if (this.status !== "COMPLETED") {
      this.completed_at = undefined;
    }
  }
  next();
});

export const taskModel = model("Task", taskSchema);
