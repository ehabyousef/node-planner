import { Types } from "mongoose";

export interface userType {
  _id: Types.ObjectId;
  email: string;
  userName: string;
  password: string;
}

// Interface for Goal document

export interface IGoal {
  user: Types.ObjectId;
  category_id: Types.ObjectId;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  progress_percent: number;
  start_date?: Date;
  end_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ITask {
  user: Types.ObjectId;
  goal_id: Types.ObjectId;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  progress_percent: number;
  start_date?: Date;
  end_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
