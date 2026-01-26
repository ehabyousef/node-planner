import { model, Schema } from "mongoose";

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
  },
  { timestamps: true },
);

// Virtual for goals (query from Goal model via category_id)
categoriesSchema.virtual("goals", {
  ref: "Goal",
  localField: "_id",
  foreignField: "category_id",
});

// Enable virtuals in JSON
categoriesSchema.set("toJSON", { virtuals: true });
categoriesSchema.set("toObject", { virtuals: true });

export const categories = model("Categories", categoriesSchema);
