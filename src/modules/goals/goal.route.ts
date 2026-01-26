import express from "express";
import { Validator } from "../../middleware/validator";
import { verifyToken } from "../../middleware/verifyToken";
import { addGoal, allGoals, deleteGoal, singleGoal, updateGoal } from "./goal.controller";
import { createGoalValidation, updateGoalValidation } from "./goal.validation";
import { requireAuth } from "../../middleware/requireAuth";

export const goalRoter = express.Router();
goalRoter.use(verifyToken, requireAuth);

goalRoter.get("/", allGoals);
goalRoter.get("/:id", singleGoal);

goalRoter.post("/addGoal", Validator(createGoalValidation), addGoal);
goalRoter.put("/updateGoal/:id", Validator(updateGoalValidation), updateGoal);
goalRoter.delete("/deleteGoal/:id", deleteGoal);
