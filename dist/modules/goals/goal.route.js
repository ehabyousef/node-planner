"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalRoter = void 0;
const express_1 = __importDefault(require("express"));
const validator_1 = require("../../middleware/validator");
const verifyToken_1 = require("../../middleware/verifyToken");
const goal_controller_1 = require("./goal.controller");
const goal_validation_1 = require("./goal.validation");
const requireAuth_1 = require("../../middleware/requireAuth");
const multer_1 = require("../../middleware/multer");
exports.goalRoter = express_1.default.Router();
exports.goalRoter.use(verifyToken_1.verifyToken, requireAuth_1.requireAuth);
exports.goalRoter.get("/", goal_controller_1.allGoals);
exports.goalRoter.get("/:id", goal_controller_1.singleGoal);
// Image upload: use 'image' as the field name in your form-data
exports.goalRoter.post("/addGoal", multer_1.upload.single("image"), (0, validator_1.Validator)(goal_validation_1.createGoalValidation), goal_controller_1.addGoal);
exports.goalRoter.put("/updateGoal/:id", multer_1.upload.single("image"), (0, validator_1.Validator)(goal_validation_1.updateGoalValidation), goal_controller_1.updateGoal);
exports.goalRoter.delete("/deleteGoal/:id", goal_controller_1.deleteGoal);
