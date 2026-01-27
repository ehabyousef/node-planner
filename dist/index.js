"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_route_1 = require("./modules/auth/auth.route");
const goal_route_1 = require("./modules/goals/goal.route");
const task_route_1 = require("./modules/tasks/task.route");
const categories_route_1 = require("./modules/cateogries/categories.route");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// Routes
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
app.use("/api/auth", auth_route_1.authRouter);
app.use("/api/goals", goal_route_1.goalRoter);
app.use("/api/tasks", task_route_1.taskRouter);
app.use("/api/categories", categories_route_1.categoriesRouter);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorhandler);
exports.default = app;
