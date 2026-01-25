import { model, Schema, Types } from "mongoose";

const categoriesSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    color: {
      type: String,
      required: true,
    },
    goals: [
      {
        _id: false,
        goals: { type: Types.ObjectId, ref: "Goal" },
      },
    ],
  },
  { timestamps: true },
);
export const categories = model("Categories", categoriesSchema);
