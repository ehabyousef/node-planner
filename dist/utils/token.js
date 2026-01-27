"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.genToken = genToken;
