"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../../DB/models/user.model");
const token_1 = require("../../utils/token");
exports.Register = (0, express_async_handler_1.default)(async (req, res) => {
    const existUser = await user_model_1.User.findOne({ email: req.body.email });
    if (existUser) {
        res.status(400).json({ message: "user already exist log in please" });
    }
    // hash pass
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashPass = await bcryptjs_1.default.hash(req.body.password, salt);
    const user = new user_model_1.User({
        email: req.body.email,
        password: hashPass,
        userName: req.body.userName,
    });
    await user.save();
    res.status(201).json({ message: "user created", token: (0, token_1.genToken)(user) });
});
exports.Login = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await user_model_1.User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }
    const isPass = await bcryptjs_1.default.compare(req.body.password, user.password);
    if (!isPass) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }
    res.status(200).json({ message: "logged in", token: (0, token_1.genToken)(user) });
});
