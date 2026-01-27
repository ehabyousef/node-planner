import express from "express";
import { Validator } from "../../middleware/validator";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addGoal,
  allGoals,
  deleteGoal,
  singleGoal,
  updateGoal,
} from "./goal.controller";
import { createGoalValidation, updateGoalValidation } from "./goal.validation";
import { requireAuth } from "../../middleware/requireAuth";
import { upload } from "../../middleware/multer";

export const goalRoter = express.Router();
goalRoter.use(verifyToken, requireAuth);

goalRoter.get("/", allGoals);
goalRoter.get("/:id", singleGoal);

// Image upload: use 'image' as the field name in your form-data
goalRoter.post(
  "/addGoal",
  upload.single("image"),
  Validator(createGoalValidation),
  addGoal,
);
goalRoter.put(
  "/updateGoal/:id",
  upload.single("image"),
  Validator(updateGoalValidation),
  updateGoal,
);
goalRoter.delete("/deleteGoal/:id", deleteGoal);
