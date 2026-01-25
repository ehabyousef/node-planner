import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express()

// Middlewares
app.use(helmet());
app.use(
  cors()
  //   {
  //   origin: "https://hedaya-fd5c7.web.app",
  //   credentials: true,
  // }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
// app.use("/api/auth", registerRoute);

export default app