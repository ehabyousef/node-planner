"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            logger_1.default.error("❌ MONGO_URI is not defined in environment variables.");
            process.exit(1);
        }
        const conn = await mongoose_1.default.connect(mongoUri);
        logger_1.default.info(`📦 MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("❌ MongoDB connection failed:", error.message);
        }
        else {
            logger_1.default.error("❌ MongoDB connection failed:", String(error));
        }
        process.exit(1);
    }
};
exports.connectDB = connectDB;
