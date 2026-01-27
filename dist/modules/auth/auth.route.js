"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const validator_1 = require("../../middleware/validator");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/register", (0, validator_1.Validator)(auth_validation_1.registerValidation), auth_controller_1.Register);
exports.authRouter.post("/login", (0, validator_1.Validator)(auth_validation_1.loginValidation), auth_controller_1.Login);
