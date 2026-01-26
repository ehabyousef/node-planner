import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./modules/auth/auth.route";
import { goalRoter } from "./modules/goals/goal.route";
import { taskRouter } from "./modules/tasks/task.route";
import { errorhandler, notFound } from "./middleware/errorHandler";

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors(),
  //   {
  //   origin: "https://hedaya-fd5c7.web.app",
  //   credentials: true,
  // }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/goals", goalRoter);
app.use("/api/tasks", taskRouter);
app.use(notFound);
app.use(errorhandler);
export default app;
