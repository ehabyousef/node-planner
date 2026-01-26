import express from "express";
import { Validator } from "../../middleware/validator";
import { loginValidation, registerValidation } from "./auth.validation";
import { Login, Register } from "./auth.controller";

export const authRouter = express.Router();

authRouter.post("/register", Validator(registerValidation), Register);
authRouter.post("/login", Validator(loginValidation), Login);
