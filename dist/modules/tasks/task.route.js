"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../../middleware/verifyToken");
const requireAuth_1 = require("../../middleware/requireAuth"); // ✅ Add this
const task_controller_1 = require("./task.controller");
const validator_1 = require("../../middleware/validator");
const task_validation_1 = require("./task.validation");
exports.taskRouter = express_1.default.Router();
// ✅ Apply requireAuth after verifyToken
exports.taskRouter.use(verifyToken_1.verifyToken, requireAuth_1.requireAuth);
exports.taskRouter.get("/:goalId", task_controller_1.getTasks);
exports.taskRouter.get("/:goalId/:id", task_controller_1.singleTask);
exports.taskRouter.post("/addTask", (0, validator_1.Validator)(task_validation_1.createTaskValidation), task_controller_1.addTask);
exports.taskRouter.put("/updateTask/:id", (0, validator_1.Validator)(task_validation_1.updateTaskValidation), task_controller_1.updateTask);
exports.taskRouter.post("/deleteTask/:id", task_controller_1.deletetask);
