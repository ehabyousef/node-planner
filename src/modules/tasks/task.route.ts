import express from "express";
import { verifyToken } from "../../middleware/verifyToken";
import { requireAuth } from "../../middleware/requireAuth"; // ✅ Add this
import { addTask, getTasks, singleTask, updateTask } from "./task.controller";
import { Validator } from "../../middleware/validator";
import { createTaskValidation, updateTaskValidation } from "./task.validation";

export const taskRouter = express.Router();

// ✅ Apply requireAuth after verifyToken
taskRouter.use(verifyToken, requireAuth);

taskRouter.get("/", getTasks);
taskRouter.get("/:id", singleTask);
taskRouter.post("/addTask", Validator(createTaskValidation), addTask);
taskRouter.put("/updateTask/:id", Validator(updateTaskValidation), updateTask);
