import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      logger.error("❌ MONGO_URI is not defined in environment variables.");
      process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri);
    logger.info(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error ) {
    if (error instanceof Error) {
      logger.error("❌ MongoDB connection failed:", error.message);
    } else {
      logger.error("❌ MongoDB connection failed:", String(error));
    }
    process.exit(1);
  }
};
