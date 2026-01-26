import express from "express";
import { Validator } from "../../middleware/validator";
import { verifyToken } from "../../middleware/verifyToken";
import { addGoal, allGoals, singleGoal, updateGoal } from "./goal.controller";
import { createGoalValidation, updateGoalValidation } from "./goal.validation";

export const goalRoter = express.Router();

goalRoter.get("/", verifyToken, allGoals);
goalRoter.get("/:id", verifyToken, singleGoal);

goalRoter.post(
  "/addGoal",
  verifyToken,
  Validator(createGoalValidation),
  addGoal,
);

goalRoter.put(
  "/updateGoal",
  verifyToken,
  Validator(updateGoalValidation),
  updateGoal,
);
